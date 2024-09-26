import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TouristModule } from './tourist/tourist.module';


@Module({
  imports: [CommonModule, UserModule, TouristModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
