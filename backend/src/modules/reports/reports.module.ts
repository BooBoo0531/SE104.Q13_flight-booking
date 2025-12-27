import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Flight } from '../flights/entities/flight.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Ticket])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}