import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN') // Need to add SELLER role later but currently we assume any authorised role or SELLER
  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.productsService.create(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.productsService.update(id, req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.productsService.remove(id, req.user.id);
  }
}
