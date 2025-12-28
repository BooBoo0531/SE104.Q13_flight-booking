import { Controller, Post, Body, Get, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('flights')
export class FlightsController {
  constructor(private readonly svc: FlightsService) {}

  // ✔ Xem danh sách: Tất cả roles
  @Roles('Quản trị', 'Điều hành bay', 'Nhân viên')
  @Get()
  list() {
    return this.svc.findAll();
  }

  // ✔ Route test quyền (phải đặt trước :id)
  @Roles('Quản trị', 'Điều hành bay')
  @Get('admin-only')
  adminRoute() {
    return 'Chỉ admin & manager';
  }

  // ✔ Xem chi tiết: Tất cả roles
  @Roles('Quản trị', 'Điều hành bay', 'Nhân viên')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  // ✔ Tạo chuyến bay: Quản trị, Điều hành bay
  @Roles('Quản trị', 'Điều hành bay')
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.svc.create(dto);
  }

  // ✔ Cập nhật chuyến bay: Quản trị, Điều hành bay
  @Roles('Quản trị', 'Điều hành bay')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateFlightDto) {
    return this.svc.update(Number(id), dto);
  }

  // ✔ Xóa chuyến bay: Quản trị, Điều hành bay
  @Roles('Quản trị', 'Điều hành bay')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
