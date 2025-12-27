import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirplanesService } from './airplanes.service';
import { AirplanesController } from './airplanes.controller';
import { Airplane } from './entities/airplane.entity';
import { Seat } from '../seats/entities/seat.entity'; // ✅ thêm dòng này

@Module({
  imports: [TypeOrmModule.forFeature([Airplane, Seat])], // ✅ thêm Seat
  controllers: [AirplanesController],
  providers: [AirplanesService],
})
export class AirplanesModule {}
