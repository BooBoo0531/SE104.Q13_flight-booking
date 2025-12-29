import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { TicketClassesService } from './ticket-classes.service';
import { TicketClassesController } from './ticket-classes.controller';
import { FlightTicketClass } from '../flight-ticket-classes/entities/flight-ticket-class.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Flight } from '../flights/entities/flight.entity';
import { Airplane } from '../airplanes/entities/airplane.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketClass, FlightTicketClass, Seat, Flight, Airplane])],
  controllers: [TicketClassesController],
  providers: [TicketClassesService],
  exports: [TicketClassesService],
})
export class TicketClassesModule {}
