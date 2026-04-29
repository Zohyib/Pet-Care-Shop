import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from '../schemas/message.schema';
import { JwtModule } from '@nestjs/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule.register({ secret: JWT_SECRET }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
