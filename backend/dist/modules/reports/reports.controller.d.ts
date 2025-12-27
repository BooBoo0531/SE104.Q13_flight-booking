import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getMonthlyReport(monthStr: string): Promise<{
        summary: {
            totalFlights: number;
            totalTickets: number;
            totalRevenue: number;
        };
        details: any[];
    }>;
    getYearlyReport(yearStr: string): Promise<{
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
