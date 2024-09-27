import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TouristModule } from './tourist/tourist.module';
import { TripModule } from './trip/trip.module';
import { BookingModule } from './booking/booking.module';


@Module({
  imports: [CommonModule, UserModule, TouristModule, TripModule, BookingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
