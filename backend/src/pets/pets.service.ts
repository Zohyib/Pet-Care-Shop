import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, data: any) {
    return (this.prisma as any).pet.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  async findAllByOwner(ownerId: string) {
    return (this.prisma as any).pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pet = await (this.prisma as any).pet.findUnique({
      where: { id },
      include: { owner: { select: { name: true, email: true } } },
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async update(id: string, data: any) {
    return (this.prisma as any).pet.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return (this.prisma as any).pet.delete({
      where: { id },
    });
  }
}
