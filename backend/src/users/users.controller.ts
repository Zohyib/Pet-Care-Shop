import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('contacts')
  async getContacts(@Request() req: any) {
    const roleToFind = req.user.role === 'DOCTOR' ? 'USER' : 'DOCTOR';
    return this.usersService.findContacts(roleToFind);
  }

  @Get('profile/me')
  async getMyProfile(@Request() req: any) {
    const userId = req.user.id || req.user._id?.toString();
    return this.usersService.getProfile(userId);
  }

  @Put('profile/me')
  async updateMyProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user.id || req.user._id?.toString();
    return this.usersService.updateProfile(userId, body);
  }
}
