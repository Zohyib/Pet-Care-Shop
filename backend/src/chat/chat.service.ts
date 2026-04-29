import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async saveMessage(senderId: string, receiverId: string, content: string) {
    const msg = await this.messageModel.create({
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      content,
    });
    const populated = await msg.populate('senderId', 'id name role');
    const obj = populated.toObject() as any;
    return {
      ...obj,
      id: obj._id?.toString(),
      senderId: obj.senderId?._id?.toString(),
      sender: obj.senderId,
    };
  }

  async getConversation(userId: string, contactId: string) {
    const msgs = await this.messageModel.find({
      $or: [
        { senderId: new Types.ObjectId(userId), receiverId: new Types.ObjectId(contactId) },
        { senderId: new Types.ObjectId(contactId), receiverId: new Types.ObjectId(userId) },
      ],
    }).populate('senderId', 'id name').sort({ createdAt: 1 }).lean();
    return msgs.map((m: any) => ({
      ...m,
      id: m._id?.toString(),
      senderId: m.senderId?._id?.toString(),
      sender: m.senderId,
    }));
  }
}
