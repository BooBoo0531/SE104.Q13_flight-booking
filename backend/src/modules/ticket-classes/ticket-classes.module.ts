import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { TicketClassesService } from './ticket-classes.service';
import { TicketClassesController } from './ticket-classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketClass])],
  controllers: [TicketClassesController],
  providers: [TicketClassesService],
  exports: [TicketClassesService],
})
export class TicketClassesModule {}
