import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.ordersService.createOrder(req.user.id, data);
  }

  @Get('my-orders')
  findMyOrders(@Request() req: any) {
    return this.ordersService.findOrdersByUser(req.user.id);
  }

  @Get('seller-orders')
  findSellerOrders(@Request() req: any) {
    return this.ordersService.findSellerOrders(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
