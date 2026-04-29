import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Review, ReviewSchema } from '../schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
