import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Appointment, AppointmentSchema } from '../schemas/appointment.schema';
import { Order, OrderSchema } from '../schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
