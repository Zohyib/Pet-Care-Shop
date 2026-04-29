import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class DoctorProfile {
  @Prop() locationCity?: string;
  @Prop() locationCountry?: string;
  @Prop() education?: string;
  @Prop() certifications?: string;
  @Prop({ default: 0 }) yearsOfExperience: number;
  @Prop() mainSpecialization?: string;
  @Prop() expertise?: string;
  @Prop() bio?: string;
  @Prop() clinicName?: string;
  @Prop() clinicAddress?: string;
  @Prop({ default: 0 }) consultationFee: number;
  @Prop() languages?: string;
  @Prop({ default: 0 }) rating: number;
  @Prop({ default: 0 }) totalPatients: number;
  @Prop({ default: false }) isProfileComplete: boolean;
}
const DoctorProfileSchema = SchemaFactory.createForClass(DoctorProfile);

@Schema({ _id: false })
class SellerProfile {
  @Prop() businessName?: string;
  @Prop() contactNumber?: string;
  @Prop() address?: string;
  @Prop() category?: string;
  @Prop() description?: string;
  @Prop({ default: 'PENDING' }) status: string;
  @Prop() stripeAccountId?: string;
}
const SellerProfileSchema = SchemaFactory.createForClass(SellerProfile);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, index: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ default: 'USER' }) role: string;
  @Prop({ default: 'ACTIVE' }) status: string;
  @Prop() phone?: string;
  @Prop() avatarUrl?: string;
  @Prop({ type: DoctorProfileSchema }) doctorProfile?: DoctorProfile;
  @Prop({ type: SellerProfileSchema }) sellerProfile?: SellerProfile;
}

export const UserSchema = SchemaFactory.createForClass(User);
