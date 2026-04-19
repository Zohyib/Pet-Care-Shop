import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
    return (this.usersService as any).prisma.user.findMany({
      where: { role: roleToFind },
      select: { id: true, name: true, role: true, email: true },
    });
  }
}
