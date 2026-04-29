import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from '../schemas/appointment.schema';

const toStr = (doc: any) => doc ? { ...doc, id: doc._id?.toString(), userId: doc.userId?.toString(), doctorId: doc.doctorId?.toString(), petId: doc.petId?.toString() } : null;

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private aptModel: Model<AppointmentDocument>) {}

  async create(userId: string, data: any) {
    const requestedDate = new Date(data.date);
    const existing = await this.aptModel.findOne({
      doctorId: new Types.ObjectId(data.doctorId),
      date: requestedDate,
      status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    });
    if (existing) throw new NotFoundException('This time slot is already booked.');

    const apt = await this.aptModel.create({
      date: requestedDate,
      notes: data.notes,
      userId: new Types.ObjectId(userId),
      doctorId: new Types.ObjectId(data.doctorId),
      petId: new Types.ObjectId(data.petId),
      status: 'PENDING',
    });
    return toStr(apt.toObject());
  }

  async getBookedSlots(doctorId: string, dateStr: string) {
    const startOfDay = new Date(dateStr); startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr); endOfDay.setUTCHours(23, 59, 59, 999);
    const apts = await this.aptModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    }).select('date').lean();
    return apts.map((a: any) => a.date.toISOString());
  }

  async findAllForUser(userId: string) {
    const apts = await this.aptModel.find({ userId: new Types.ObjectId(userId) })
      .populate('doctorId', 'name avatarUrl')
      .populate('petId', 'name breed')
      .sort({ date: 1 }).lean();
    return apts.map((a: any) => ({
      ...a, id: a._id?.toString(),
      doctorId: a.doctorId?._id?.toString(),
      doctor: a.doctorId,
      pet: a.petId,
      petId: a.petId?._id?.toString(),
      userId: a.userId?.toString(),
    }));
  }

  async findAllForDoctor(doctorId: string) {
    const apts = await this.aptModel.find({ doctorId: new Types.ObjectId(doctorId) })
      .populate('userId', 'name avatarUrl')
      .populate('petId', 'name breed')
      .sort({ date: 1 }).lean();
    return apts.map((a: any) => ({
      ...a, id: a._id?.toString(),
      userId: a.userId?._id?.toString(),
      user: a.userId,
      pet: a.petId,
      petId: a.petId?._id?.toString(),
      doctorId: a.doctorId?.toString(),
    }));
  }

  async updateStatus(id: string, status: string) {
    const apt = await this.aptModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).lean();
    return toStr(apt);
  }

  async updateAppointment(id: string, data: any) {
    const apt = await this.aptModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
    return toStr(apt);
  }
}
