import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(sellerId: string, data: any) {
    const p = await this.productModel.create({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: data.imageUrl,
      category: data.category,
      stock: parseInt(data.stock, 10) || 0,
      sellerId: new Types.ObjectId(sellerId),
    });
    return { ...p.toObject(), id: p._id?.toString() };
  }

  async findAll(query: any) {
    const filter: any = {};
    if (query.sellerId) filter.sellerId = new Types.ObjectId(query.sellerId);
    const products = await this.productModel.find(filter)
      .populate('sellerId', 'name').sort({ createdAt: -1 }).lean();
    return products.map((p: any) => ({ ...p, id: p._id?.toString(), seller: p.sellerId, sellerId: p.sellerId?._id?.toString() }));
  }

  async findOne(id: string) {
    const p = await this.productModel.findById(id).populate('sellerId', 'name').lean() as any;
    if (!p) throw new NotFoundException('Product not found');
    return { ...p, id: p._id?.toString(), seller: p.sellerId, sellerId: p.sellerId?._id?.toString() };
  }

  async update(id: string, sellerId: string, data: any) {
    const existing = await this.productModel.findById(id).lean() as any;
    if (!existing || existing.sellerId?.toString() !== sellerId) throw new NotFoundException('Product not found or unauthorized');
    const p = await this.productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean() as any;
    return { ...p, id: p._id?.toString() };
  }

  async remove(id: string, sellerId: string) {
    const existing = await this.productModel.findById(id).lean() as any;
    if (!existing || existing.sellerId?.toString() !== sellerId) throw new NotFoundException('Product not found or unauthorized');
    return this.productModel.findByIdAndDelete(id);
  }
}
