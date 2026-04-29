import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) doctorId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true }) petId: Types.ObjectId;
  @Prop({ required: true }) date: Date;
  @Prop({ default: 'PENDING' }) status: string;
  @Prop() notes?: string;
  @Prop() prescriptions?: string;
  @Prop() amount?: number;
  @Prop() paymentId?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
