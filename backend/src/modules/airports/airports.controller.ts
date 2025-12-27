import { Controller, Get, Param } from '@nestjs/common';
import { AirportsService } from './airports.service';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  /**
   * GET /airports - Lấy danh sách tất cả sân bay
   */
  @Get()
  findAll() {
    return this.airportsService.findAll();
  }

  /**
   * GET /airports/:id - Lấy chi tiết 1 sân bay
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(+id);
  }
}
