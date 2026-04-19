import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return (this.prisma as any).appointment.create({
      data: {
        date: new Date(data.date),
        notes: data.notes,
        userId,
        doctorId: data.doctorId,
        petId: data.petId,
        status: 'PENDING',
      },
    });
  }

  async findAllForUser(userId: string) {
    return (this.prisma as any).appointment.findMany({
      where: { userId },
      include: { doctor: { select: { name: true } }, pet: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async findAllForDoctor(doctorId: string) {
    return (this.prisma as any).appointment.findMany({
      where: { doctorId },
      include: { user: { select: { name: true } }, pet: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return (this.prisma as any).appointment.update({
      where: { id },
      data: { status },
    });
  }
}
