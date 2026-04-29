import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private stripeService: StripeService,
  ) {}

  async createOrder(userId: string, data: { items: { productId: string; quantity: number }[] }) {
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of data.items) {
      const product = await this.productModel.findById(item.productId).lean() as any;
      if (!product) continue;
      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: product._id, quantity: item.quantity, price: product.price, productName: product.name });
    }

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      totalAmount,
      status: 'PENDING',
      items: orderItems,
    });

    const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount, 'usd', { orderId: order._id.toString() });
    await this.orderModel.findByIdAndUpdate(order._id, { paymentId: paymentIntent.id });

    return { orderId: order._id.toString(), totalAmount, clientSecret: paymentIntent.clientSecret, paymentId: paymentIntent.id };
  }

  async findOrdersByUser(userId: string) {
    const orders = await this.orderModel.find({ userId: new Types.ObjectId(userId) })
      .populate('items.productId').sort({ createdAt: -1 }).lean();
    return orders.map((o: any) => ({
      ...o,
      id: o._id?.toString(),
      userId: o.userId?.toString(),
      items: o.items?.map((i: any) => ({ ...i, product: i.productId }))
    }));
  }

  async findSellerOrders(sellerId: string) {
    const sellerObjectId = new Types.ObjectId(sellerId);
    const orders = await this.orderModel.find({
      'items.productId': { $in: await this.productModel.find({ sellerId: sellerObjectId }).distinct('_id') }
    }).populate('userId', 'name email').populate('items.productId').sort({ createdAt: -1 }).lean();
    return orders.map((o: any) => ({
      ...o, id: o._id?.toString(),
      user: o.userId,
      userId: o.userId?._id?.toString(),
      items: o.items?.map((i: any) => ({ ...i, product: i.productId }))
    }));
  }

  async findOne(id: string) {
    const o = await this.orderModel.findById(id).populate('items.productId').lean() as any;
    if (!o) return null;
    return {
      ...o,
      id: o._id?.toString(),
      items: o.items?.map((i: any) => ({ ...i, product: i.productId }))
    };
  }

  async updateStatus(id: string, status: string) {
    const o = await this.orderModel.findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).lean() as any;
    return { ...o, id: o?._id?.toString() };
  }
}
