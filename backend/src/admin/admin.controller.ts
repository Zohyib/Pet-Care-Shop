import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers(@Query('role') role?: string) {
    return this.adminService.getAllUsers(role);
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('doctors')
  getDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Get('products')
  getProducts() {
    return this.adminService.getAllProducts();
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('appointments')
  getAppointments() {
    return this.adminService.getAllAppointments();
  }

  @Put('appointments/:id/status')
  updateAppointmentStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateAppointmentStatus(id, status);
  }

  @Get('orders')
  getOrders() {
    return this.adminService.getAllOrders();
  }
}
