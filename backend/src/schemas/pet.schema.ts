import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true }) name: string;
  @Prop() breed?: string;
  @Prop() age?: number;
  @Prop() history?: string;
  @Prop() imageUrl?: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) ownerId: Types.ObjectId;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
