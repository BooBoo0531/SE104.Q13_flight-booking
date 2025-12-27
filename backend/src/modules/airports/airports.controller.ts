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
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  // GET public để DashboardScreen load danh sách sân bay
  @Get()
  findAll() {
    return this.airportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(+id);
  }

  // --- CRUD cho SettingsTab (chỉ Quản trị) ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Post()
  create(@Body() dto: CreateAirportDto) {
    return this.airportsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAirportDto) {
    return this.airportsService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airportsService.remove(+id);
  }
}
