import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Flight } from '../flights/entities/flight.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketsSchemaService } from './tickets.schema.service';

// ✅ thêm import Booking
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  // ✅ thêm Booking vào forFeature
  imports: [TypeOrmModule.forFeature([Ticket, Flight, Booking])],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsSchemaService],
  exports: [TicketsService],
})
export class TicketsModule {}
