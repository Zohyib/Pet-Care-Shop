import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async getAllDoctors(@Query('search') search: string, @Query('specialty') specialty: string) {
    return this.doctorsService.findAllDoctors(search, specialty);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getMyProfile(@Request() req: any) {
    const userId = req.user.id;
    return this.doctorsService.getProfileByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateMyProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user.id;
    return this.doctorsService.updateProfile(userId, body);
  }

  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  async addReview(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { rating: number; comment?: string }
  ) {
    const userId = req.user.id;
    return this.doctorsService.addReview(id, userId, body.rating, body.comment);
  }
}
