import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { IntermediateAirport } from '../intermediate-airports/entities/intermediate-airport.entity';
import { FlightTicketClass } from '../flight-ticket-classes/entities/flight-ticket-class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Flight,
      Setting,
      IntermediateAirport, // ✅ quan trọng
      FlightTicketClass,   // ✅ nên thêm để khỏi lỗi dây chuyền
    ]),
  ],
  providers: [FlightsService],
  controllers: [FlightsController],
})
export class FlightsModule {}
