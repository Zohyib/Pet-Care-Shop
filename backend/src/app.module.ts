import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { DoctorsModule } from './doctors/doctors.module';
import { StripeModule } from './stripe/stripe.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { SellersModule } from './sellers/sellers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/petcareshop',
    ),
    UsersModule, AuthModule, PetsModule, AppointmentsModule,
    ChatModule, AiModule, DoctorsModule, StripeModule,
    ProductsModule, OrdersModule, AdminModule, SellersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

