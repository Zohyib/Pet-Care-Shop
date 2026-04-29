import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: Types.ObjectId;
  @Prop({ required: true }) quantity: number;
  @Prop({ required: true }) price: number;
  @Prop() productName?: string;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) totalAmount: number;
  @Prop({ default: 'PENDING' }) status: string;
  @Prop() paymentId?: string;
  @Prop({ type: [OrderItemSchema], default: [] }) items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
