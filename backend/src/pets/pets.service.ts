import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from '../schemas/pet.schema';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(ownerId: string, data: any) {
    const pet = await this.petModel.create({ ...data, ownerId: new Types.ObjectId(ownerId) });
    return { ...pet.toObject(), id: pet._id?.toString() };
  }

  async findAllByOwner(ownerId: string) {
    const pets = await this.petModel.find({ ownerId: new Types.ObjectId(ownerId) }).sort({ createdAt: -1 }).lean();
    return pets.map(p => ({ ...p, id: (p as any)._id?.toString() }));
  }

  async findOne(id: string) {
    const pet = await this.petModel.findById(id).populate('ownerId', 'name email').lean();
    if (!pet) throw new NotFoundException('Pet not found');
    return { ...pet, id: (pet as any)._id?.toString() };
  }

  async update(id: string, data: any) {
    const pet = await this.petModel.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
    return { ...pet, id: (pet as any)?._id?.toString() };
  }

  async delete(id: string) {
    return this.petModel.findByIdAndDelete(id);
  }
}
