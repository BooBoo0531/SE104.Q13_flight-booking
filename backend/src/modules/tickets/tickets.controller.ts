import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly svc: TicketsService) {}

  @Roles('Quản trị', 'Nhân viên', 'Ban giám đốc')
  @Get()
  list() {
    return this.svc.findAll();
  }

  @Roles('Quản trị', 'Nhân viên', 'Ban giám đốc')
  @Get(':ticketId')
  get(@Param('ticketId') ticketId: string) {
    return this.svc.findOneByTicketId(ticketId);
  }

  @Roles('Quản trị', 'Nhân viên')
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.svc.create(dto);
  }

  @Roles('Quản trị', 'Nhân viên')
  @Patch(':ticketId')
  update(@Param('ticketId') ticketId: string, @Body() dto: UpdateTicketDto) {
    return this.svc.update(ticketId, dto);
  }

  @Roles('Quản trị', 'Nhân viên')
  @Delete(':ticketId')
  remove(@Param('ticketId') ticketId: string) {
    return this.svc.remove(ticketId);
  }
}
