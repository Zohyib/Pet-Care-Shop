import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
