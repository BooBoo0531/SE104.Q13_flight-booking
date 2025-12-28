import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TicketClassesService } from './ticket-classes.service';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('ticket-classes')
export class TicketClassesController {
  constructor(private readonly svc: TicketClassesService) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Post()
  create(@Body() dto: CreateTicketClassDto) {
    return this.svc.create(dto);
  }

  // ✅ Frontend có thể gọi PUT -> thêm để tránh "Cannot PUT ..."
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() dto: UpdateTicketClassDto) {
    return this.svc.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() dto: UpdateTicketClassDto) {
    return this.svc.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
