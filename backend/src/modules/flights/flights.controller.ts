import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly svc: FlightsService) {}

  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.svc.create(dto);
  }

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }
}
