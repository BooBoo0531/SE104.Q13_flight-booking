import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  async getMonthlyReport(@Query('month') monthStr: string) {
    // monthStr dạng "2024-12"
    return this.reportsService.getMonthlyReport(monthStr);
  }

  @Get('yearly')
  async getYearlyReport(@Query('year') yearStr: string) {
    // yearStr dạng "2024"
    return this.reportsService.getYearlyReport(parseInt(yearStr));
  }
}