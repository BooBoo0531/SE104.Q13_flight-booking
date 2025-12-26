import { Repository } from 'typeorm';
import { Flight } from '../flights/entities/flight.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
export declare class ReportsService {
    private flightRepo;
    private ticketRepo;
    constructor(flightRepo: Repository<Flight>, ticketRepo: Repository<Ticket>);
    getMonthlyReport(monthStr: string): Promise<{
        summary: {
            totalFlights: number;
            totalTickets: number;
            totalRevenue: number;
        };
        details: any[];
    }>;
    getYearlyReport(year: number): Promise<{
        summary: {
            totalFlights: number;
            totalRevenue: number;
        };
        details: {
            ratio: string | number;
            month: number;
            flightCount: number;
            revenue: number;
        }[];
    }>;
}
