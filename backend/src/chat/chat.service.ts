import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return (this.prisma as any).message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async getConversation(userId: string, contactId: string) {
    return (this.prisma as any).message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });
  }
}
