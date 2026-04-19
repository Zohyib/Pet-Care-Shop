import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles('USER')
  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.appointmentsService.create(req.user.id, data);
  }

  @Roles('USER', 'DOCTOR')
  @Get('my-appointments')
  findMine(@Request() req: any) {
    if (req.user.role === 'DOCTOR') {
      return this.appointmentsService.findAllForDoctor(req.user.id);
    }
    return this.appointmentsService.findAllForUser(req.user.id);
  }

  @Roles('DOCTOR', 'ADMIN')
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
