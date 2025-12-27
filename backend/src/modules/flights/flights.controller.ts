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
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('flights')
export class FlightsController {
  constructor(private readonly svc: FlightsService) {}

  @Roles('Quản trị', 'Điều hành bay', 'Nhân viên')
  @Get()
  list() {
    return this.svc.findAll();
  }

  @Roles('Quản trị', 'Điều hành bay')
  @Get('admin-only')
  adminRoute() {
    return 'Chỉ admin & manager';
  }

  @Roles('Quản trị', 'Điều hành bay', 'Nhân viên')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  @Roles('Quản trị', 'Điều hành bay')
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.svc.create(dto);
  }

  @Roles('Quản trị', 'Điều hành bay')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFlightDto) {
    return this.svc.update(Number(id), dto);
  }

  @Roles('Quản trị', 'Điều hành bay')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
