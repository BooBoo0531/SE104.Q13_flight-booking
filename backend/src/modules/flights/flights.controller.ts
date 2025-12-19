import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('flights')
export class FlightsController {
  constructor(private readonly svc: FlightsService) {}

  // ✔ Xem danh sách: admin, staff, user
  @Roles('admin', 'staff', 'user')
  @Get()
  list() {
    return this.svc.findAll();
  }

  // ✔ Route test quyền (phải đặt trước :id)
  @Roles('admin', 'manager')
  @Get('admin-only')
  adminRoute() {
    return 'Chỉ admin & manager';
  }

  // ✔ Xem chi tiết: admin, staff, user
  @Roles('admin', 'staff', 'user')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  // ✔ Tạo chuyến bay: admin, manager
  @Roles('admin', 'manager')
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.svc.create(dto);
  }
}
