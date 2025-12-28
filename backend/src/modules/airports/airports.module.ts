import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';
import { Airport } from './entities/airport.entity';
import { Flight } from '../flights/entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport, Flight])],
  controllers: [AirportsController],
  providers: [AirportsService],
  exports: [AirportsService],
})
export class AirportsModule {}
