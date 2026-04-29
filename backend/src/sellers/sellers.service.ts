import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class SellersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createRequest(userId: string, data: any) {
    const user = await this.userModel.findById(userId).lean() as any;
    if (!user) throw new NotFoundException('User not found');
    if (user.sellerProfile) throw new ConflictException('Seller request already exists');

    const updated = await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        sellerProfile: {
          businessName: data.businessName, contactNumber: data.contactNumber,
          address: data.address, category: data.category, description: data.description, status: 'PENDING',
        }
      }
    }, { returnDocument: 'after' }).lean() as any;

    return { ...updated.sellerProfile, userId, id: userId };
  }

  async getMyRequest(userId: string) {
    const user = await this.userModel.findById(userId).lean() as any;
    return user?.sellerProfile ? { ...user.sellerProfile, userId, id: userId } : null;
  }

  async getAllRequests() {
    const users = await this.userModel.find({ sellerProfile: { $exists: true } }).select('-password').lean();
    return users.map((u: any) => ({
      ...u.sellerProfile, id: u._id?.toString(), userId: u._id?.toString(),
      user: { name: u.name, email: u.email },
    }));
  }

  async updateRequestStatus(id: string, status: string) {
    const user = await this.userModel.findById(id).lean() as any;
    if (!user || !user.sellerProfile) throw new NotFoundException('Seller request not found');
    const updateData: any = { 'sellerProfile.status': status };
    if (status === 'APPROVED') updateData.role = 'SELLER';
    await this.userModel.findByIdAndUpdate(id, { $set: updateData });
    return { success: true, status };
  }

  async updateStripeAccount(userId: string, stripeAccountId: string) {
    return this.userModel.findByIdAndUpdate(userId, { $set: { 'sellerProfile.stripeAccountId': stripeAccountId } });
  }
}
