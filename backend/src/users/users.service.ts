import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  async findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async findContacts(role: string) {
    const users = await this.userModel.find({ role }).select('name role email avatarUrl').lean();
    return users.map((u: any) => ({ ...u, id: u._id?.toString() }));
  }

  async create(data: any) {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || 'USER',
    });

    const { password, ...result } = user.toObject();
    return { ...result, id: result._id?.toString() };
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new ConflictException('User not found');
    const { password, ...result } = user as any;
    return { ...result, id: result._id?.toString() };
  }

  async updateProfile(id: string, data: any) {
    if (data.role) delete data.role;

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;

    if (data.newPassword) {
      const user = await this.userModel.findById(id).lean() as any;
      if (!user) throw new ConflictException('User not found');
      if (!data.oldPassword) throw new ConflictException('Old password is required');
      const isMatch = await bcrypt.compare(data.oldPassword, user.password);
      if (!isMatch) throw new ConflictException('Invalid old password');
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    if (data.doctorProfile) {
      const user = await this.userModel.findById(id).lean() as any;
      if (user?.role === 'DOCTOR') {
        Object.keys(data.doctorProfile).forEach(k => {
          updateData[`doctorProfile.${k}`] = data.doctorProfile[k];
        });
      }
    }

    if (data.sellerProfile) {
      const user = await this.userModel.findById(id).lean() as any;
      if (user?.role === 'SELLER') {
        const { status: _s, stripeAccountId: _st, ...sellerUpdate } = data.sellerProfile;
        Object.keys(sellerUpdate).forEach(k => {
          updateData[`sellerProfile.${k}`] = sellerUpdate[k];
        });
      }
    }

    const updated = await this.userModel.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' }).lean() as any;
    const { password, ...result } = updated;
    return { ...result, id: result._id?.toString() };
  }
}
