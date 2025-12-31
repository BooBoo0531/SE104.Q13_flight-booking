"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_entity_1 = require("../flights/entities/flight.entity");
const ticket_entity_1 = require("../tickets/entities/ticket.entity");
let ReportsService = class ReportsService {
    flightRepo;
    ticketRepo;
    constructor(flightRepo, ticketRepo) {
        this.flightRepo = flightRepo;
        this.ticketRepo = ticketRepo;
    }
    async getMonthlyReport(monthStr) {
        const [year, month] = monthStr.split('-').map(Number);
        const query = this.flightRepo.createQueryBuilder('flight')
            .leftJoinAndSelect('flight.fromAirport', 'fromAirport')
            .leftJoinAndSelect('flight.toAirport', 'toAirport')
            .leftJoinAndSelect('flight.tickets', 'tickets')
            .where('EXTRACT(YEAR FROM flight.startTime) = :year AND EXTRACT(MONTH FROM flight.startTime) = :month', { year, month });
        const flights = await query.getMany();
        let totalFlights = flights.length;
        let totalTickets = 0;
        let totalRevenue = 0;
        const details = [];
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
    async getYearlyReport(year) {
        const flights = await this.flightRepo.createQueryBuilder('flight')
            .leftJoinAndSelect('flight.tickets', 'tickets')
            .where('EXTRACT(YEAR FROM flight.startTime) = :year', { year })
            .getMany();
        const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            flightCount: 0,
            revenue: 0,
            ratio: 0
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map