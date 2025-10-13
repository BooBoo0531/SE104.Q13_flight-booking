import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { Flight } from './entities/flight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  providers: [FlightsService],
  controllers: [FlightsController],
})
export class FlightsModule {}
