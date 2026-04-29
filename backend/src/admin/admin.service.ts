import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Appointment, AppointmentDocument } from '../schemas/appointment.schema';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Appointment.name) private aptModel: Model<AppointmentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getDashboardStats() {
    const [total, users, doctors, sellers, products, appointments, orders] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: 'USER' }),
      this.userModel.countDocuments({ role: { $in: ['DOCTOR', 'VET'] } }),
      this.userModel.countDocuments({ role: 'SELLER' }),
      this.productModel.countDocuments(),
      this.aptModel.countDocuments(),
      this.orderModel.countDocuments(),
    ]);
    const completedOrders = await this.orderModel.find({ status: 'DELIVERED' }).lean();
    const completedApts = await this.aptModel.find({ status: 'COMPLETED' }).lean();
    const revenue = completedOrders.reduce((s: number, o: any) => s + o.totalAmount, 0)
      + completedApts.reduce((s: number, a: any) => s + (a.amount || 0), 0);
    return { totalUsers: total, users, doctors, sellers, products, appointments, orders, revenue };
  }

  async getAllUsers(role?: string) {
    const where = role ? { role } : {};
    const users = await this.userModel.find(where).select('-password').sort({ createdAt: -1 }).lean();
    return users.map((u: any) => ({ ...u, id: u._id?.toString() }));
  }

  async updateUserStatus(id: string, status: string) {
    return this.userModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).lean();
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async getAllDoctors() {
    const docs = await this.userModel.find({ role: { $in: ['DOCTOR', 'VET'] } }).select('-password').sort({ createdAt: -1 }).lean();
    return docs.map((d: any) => ({ ...d, id: d._id?.toString() }));
  }

  async getAllProducts() {
    const products = await this.productModel.find().populate('sellerId', 'name email').sort({ createdAt: -1 }).lean();
    return products.map((p: any) => ({ ...p, id: p._id?.toString(), seller: p.sellerId }));
  }

  async deleteProduct(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }

  async getAllAppointments() {
    const apts = await this.aptModel.find()
      .populate('userId', 'name email')
      .populate('doctorId', 'name email')
      .populate('petId', 'name')
      .sort({ createdAt: -1 }).lean();
    return apts.map((a: any) => ({
      ...a, id: a._id?.toString(),
      user: a.userId, doctor: a.doctorId, pet: a.petId,
    }));
  }

  async updateAppointmentStatus(id: string, status: string) {
    return this.aptModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).lean();
  }

  async getAllOrders() {
    const orders = await this.orderModel.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 }).lean();
    return orders.map((o: any) => ({
      ...o,
      id: o._id?.toString(),
      user: o.userId,
      items: o.items?.map((i: any) => ({ ...i, product: i.productId }))
    }));
  }
}
