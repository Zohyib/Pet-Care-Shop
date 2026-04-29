import { Controller, Post, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async createRequest(@Request() req: any, @Body() body: any) {
    return this.sellersService.createRequest(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-request')
  async getMyRequest(@Request() req: any) {
    return this.sellersService.getMyRequest(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/requests')
  async getAllRequests() {
    return this.sellersService.getAllRequests();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/requests/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.sellersService.updateRequestStatus(id, status);
  }
}
