import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AirplanesService } from './airplanes.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';

@Controller('airplanes')
export class AirplanesController {
  constructor(private readonly airplanesService: AirplanesService) {}

  @Post()
  create(@Body() createAirplaneDto: CreateAirplaneDto) {
    return this.airplanesService.create(createAirplaneDto);
  }

  @Get()
  findAll() {
    return this.airplanesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airplanesService.remove(+id);
  }
}