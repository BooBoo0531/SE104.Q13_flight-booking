import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirplanesService } from './airplanes.service';
import { AirplanesController } from './airplanes.controller';
import { Airplane } from './entities/airplane.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airplane])],
  controllers: [AirplanesController],
  providers: [AirplanesService],
})
export class AirplanesModule {}