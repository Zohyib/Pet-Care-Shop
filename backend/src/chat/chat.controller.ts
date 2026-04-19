import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/:contactId')
  getHistory(@Request() req: any, @Param('contactId') contactId: string) {
    // JwtStrategy.validate() returns the full User row — id is the UUID primary key
    return this.chatService.getConversation(req.user.id, contactId);
  }
}
