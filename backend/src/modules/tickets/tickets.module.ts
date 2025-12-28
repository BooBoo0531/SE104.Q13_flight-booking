import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Flight } from '../flights/entities/flight.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Seat } from '../seats/entities/seat.entity'; // <--- 1. THÊM DÒNG NÀY
import { TicketClass } from '../ticket-classes/entities/ticket-class.entity';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketsSchemaService } from './tickets.schema.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    // 2. THÊM 'Seat' VÀO MẢNG DƯỚI ĐÂY
    TypeOrmModule.forFeature([
      Ticket, 
      Flight, 
      Booking, 
      TicketClass, 
      Seat // <--- Quan trọng: Phải có Seat thì Service mới chạy được
    ]), 
    SettingsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketsSchemaService],
  exports: [TicketsService],
})
export class TicketsModule {}