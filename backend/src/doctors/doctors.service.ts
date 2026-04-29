import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Review, ReviewDocument } from '../schemas/review.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  private async enrichWithRatings(doctors: any[]) {
    return Promise.all(doctors.map(async (doc) => {
      const reviews = await this.reviewModel.find({ doctorId: doc._id }).lean();
      const avg = reviews.length > 0
        ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;
      return {
        ...doc,
        id: doc._id?.toString(),
        doctorProfile: {
          ...doc.doctorProfile,
          calculatedRating: avg,
          totalReviews: reviews.length,
        }
      };
    }));
  }

  async findAllDoctors(search?: string, specialty?: string) {
    const query: any = { role: { $in: ['DOCTOR', 'VET'] }, 'doctorProfile.isProfileComplete': true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (specialty) {
      query.$or = [
        { 'doctorProfile.mainSpecialization': { $regex: specialty, $options: 'i' } },
        { 'doctorProfile.expertise': { $regex: specialty, $options: 'i' } },
      ];
    }
    const doctors = await this.userModel.find(query).select('-password').lean();
    return this.enrichWithRatings(doctors);
  }

  async getDoctorById(id: string) {
    const doctor = await this.userModel.findOne({ _id: new Types.ObjectId(id), role: { $in: ['DOCTOR', 'VET'] } }).select('-password').lean() as any;
    if (!doctor) throw new NotFoundException('Doctor not found');

    const reviews = await this.reviewModel.find({ doctorId: doctor._id })
      .populate('userId', 'name avatarUrl').lean();

    const avg = reviews.length > 0
      ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0;

    return {
      ...doctor,
      id: doctor._id?.toString(),
      reviewsReceived: reviews.map((r: any) => ({
        ...r, id: r._id?.toString(),
        user: r.userId ? { name: (r.userId as any).name, id: (r.userId as any)._id?.toString() } : null,
      })),
      doctorProfile: { ...doctor.doctorProfile, calculatedRating: avg, totalReviews: reviews.length },
    };
  }

  async getProfileByUserId(userId: string) {
    const user = await this.userModel.findById(userId).lean() as any;
    return user?.doctorProfile || null;
  }

  async updateProfile(userId: string, input: any) {
    const { avatarUrl, ...profileData } = input;
    const required = ['locationCity', 'locationCountry', 'yearsOfExperience', 'mainSpecialization', 'clinicName', 'clinicAddress', 'consultationFee'];

    const existing = await this.userModel.findById(userId).lean() as any;
    const merged = { ...(existing?.doctorProfile || {}), ...profileData };
    const isComplete = required.every(f => merged[f] !== undefined && merged[f] !== null && merged[f] !== '');

    const updateData: any = { role: 'DOCTOR' };
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    Object.keys(profileData).forEach(k => {
      updateData[`doctorProfile.${k}`] = profileData[k];
    });
    updateData['doctorProfile.isProfileComplete'] = isComplete;

    await this.userModel.findByIdAndUpdate(userId, { $set: updateData });
    const updated = await this.userModel.findById(userId).lean() as any;
    return updated?.doctorProfile;
  }

  async addReview(doctorId: string, userId: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be between 1 and 5');
    const doc = await this.userModel.findOne({ _id: new Types.ObjectId(doctorId), role: { $in: ['DOCTOR', 'VET'] } });
    if (!doc) throw new NotFoundException('Doctor not found');
    const review = await this.reviewModel.create({ doctorId: new Types.ObjectId(doctorId), userId: new Types.ObjectId(userId), rating, comment });
    return { ...review.toObject(), id: review._id?.toString() };
  }
}
