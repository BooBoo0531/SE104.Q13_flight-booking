import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from '../flights/entities/flight.entity';
import { Ticket } from '../tickets/entities/ticket.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  // --- BÁO CÁO THÁNG (Sửa lại cú pháp SQL cho Postgres) ---
  async getMonthlyReport(monthStr: string) {
    // monthStr: "2024-12"
    const [year, month] = monthStr.split('-').map(Number);

    // 1. Lấy tất cả chuyến bay trong tháng đó
    const query = this.flightRepo.createQueryBuilder('flight')
      .leftJoinAndSelect('flight.fromAirport', 'fromAirport')
      .leftJoinAndSelect('flight.toAirport', 'toAirport')
      .leftJoinAndSelect('flight.tickets', 'tickets')
      // 👇 SỬA DÒNG NÀY: Dùng EXTRACT thay vì YEAR/MONTH
      .where('EXTRACT(YEAR FROM flight.startTime) = :year AND EXTRACT(MONTH FROM flight.startTime) = :month', { year, month });

    const flights = await query.getMany();

    // 2. Tính toán thống kê (Giữ nguyên logic cũ)
    let totalFlights = flights.length;
    let totalTickets = 0;
    let totalRevenue = 0;
    
    const details: any[] = []; 

    for (const flight of flights) {
      const flightTickets = flight.tickets || [];
      const revenue = flightTickets.reduce((sum, t) => sum + Number(t.price), 0);
      const ticketCount = flightTickets.length;

      totalTickets += ticketCount;
      totalRevenue += revenue;

      details.push({
        id: flight.id,
        name: `${flight.fromAirport?.name} - ${flight.toAirport?.name}`,
        ticketCount,
        revenue,
        ratio: 0
      });
    }

    details.forEach(d => {
      d.ratio = totalRevenue > 0 ? ((d.revenue / totalRevenue) * 100).toFixed(2) : 0;
    });

    return {
      summary: { totalFlights, totalTickets, totalRevenue },
      details
    };
  }

  // --- BÁO CÁO NĂM (Sửa lại cú pháp SQL cho Postgres) ---
  async getYearlyReport(year: number) {
    // 1. Lấy tất cả chuyến bay trong năm
    const flights = await this.flightRepo.createQueryBuilder('flight')
      .leftJoinAndSelect('flight.tickets', 'tickets')
      // 👇 SỬA DÒNG NÀY: Dùng EXTRACT cho Postgres
      .where('EXTRACT(YEAR FROM flight.startTime) = :year', { year })
      .getMany();

    // 2. Logic tính toán giữ nguyên...
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      flightCount: 0,
      revenue: 0,
      ratio: 0 as number | string
    }));

    let totalRevenueYear = 0;
    let totalFlightsYear = 0;

    for (const flight of flights) {
      const monthIndex = new Date(flight.startTime).getMonth(); 
      const revenue = (flight.tickets || []).reduce((sum, t) => sum + Number(t.price), 0);
      
      monthlyStats[monthIndex].flightCount += 1;
      monthlyStats[monthIndex].revenue += revenue;

      totalRevenueYear += revenue;
      totalFlightsYear += 1;
    }

    const details = monthlyStats
      .filter(m => m.revenue > 0 || m.flightCount > 0)
      .map(m => ({
        ...m,
        ratio: totalRevenueYear > 0 ? ((m.revenue / totalRevenueYear) * 100).toFixed(2) : 0
      }));

    return {
      summary: { totalFlights: totalFlightsYear, totalRevenue: totalRevenueYear },
      details
    };
  }
}