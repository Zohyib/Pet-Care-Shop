import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Roles('USER', 'DOCTOR', 'ADMIN') // Doctors can see pets, Users can add them
  @Post()
  create(@Request() req: any, @Body() createPetDto: any) {
    return this.petsService.create(req.user.id, createPetDto);
  }

  @Get('my-pets')
  findAllMyPets(@Request() req: any) {
    return this.petsService.findAllByOwner(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePetDto: any) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.delete(id);
  }
}
