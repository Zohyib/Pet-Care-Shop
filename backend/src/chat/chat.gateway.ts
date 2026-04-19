import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  // userId -> Set of socketIds (supports multiple tabs/devices)
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private getUserIdFromSocket(client: Socket): string | null {
    try {
      // Token can arrive as "Bearer <token>" or plain "<token>"
      const raw: string =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization ||
        '';
      const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      if (!token) return null;

      const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
      return payload.sub as string;
    } catch (e) {
      return null;
    }
  }

  private registerSocket(userId: string, client: Socket) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);
    // Also join a named room so we can target the user easily
    client.join(`user:${userId}`);
  }

  private unregisterSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) this.userSockets.delete(userId);
    }
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  async handleConnection(client: Socket) {
    const userId = this.getUserIdFromSocket(client);

    if (!userId) {
      this.logger.warn(`[WS] Unauthorized connection attempt: ${client.id} — disconnecting.`);
      client.emit('error', { message: 'Unauthorized: invalid or missing token.' });
      client.disconnect();
      return;
    }

    client.data.userId = userId;
    this.registerSocket(userId, client);

    this.logger.log(`[WS] Connected: userId=${userId}, socketId=${client.id}`);
    client.emit('connected', { userId, socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.unregisterSocket(userId, client.id);
      this.logger.log(`[WS] Disconnected: userId=${userId}, socketId=${client.id}`);
    }
  }

  // ─── Events ──────────────────────────────────────────────────────────────────

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId: string = client.data?.userId;

    if (!senderId) {
      client.emit('error', { message: 'Not authenticated.' });
      return;
    }

    if (!data?.receiverId || !data?.content?.trim()) {
      client.emit('error', { message: 'receiverId and content are required.' });
      return;
    }

    try {
      // Persist message in DB (includes sender relation)
      const message = await this.chatService.saveMessage(
        senderId,
        data.receiverId,
        data.content.trim(),
      );

      // Emit to receiver's room (all their devices/tabs)
      this.server.to(`user:${data.receiverId}`).emit('newMessage', message);

      // Emit back to sender's room (all their tabs) so UI updates
      this.server.to(`user:${senderId}`).emit('newMessage', message);

      this.logger.log(
        `[WS] Message sent: ${senderId} → ${data.receiverId} (msgId=${message.id})`,
      );
    } catch (err) {
      this.logger.error(`[WS] Failed to save message: ${err.message}`);
      client.emit('error', { message: 'Failed to send message. Please try again.' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId: string = client.data?.userId;
    if (!senderId || !data?.receiverId) return;

    // Forward typing status to receiver only
    this.server.to(`user:${data.receiverId}`).emit('userTyping', {
      senderId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: Date.now() });
  }
}
