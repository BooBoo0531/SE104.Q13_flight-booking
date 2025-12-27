"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const airport_entity_1 = require("./modules/airports/entities/airport.entity");
const airplane_entity_1 = require("./modules/airplanes/entities/airplane.entity");
const flight_entity_1 = require("./modules/flights/entities/flight.entity");
const setting_entity_1 = require("./modules/settings/entities/setting.entity");
const seat_entity_1 = require("./modules/seats/entities/seat.entity");
const ticket_entity_1 = require("./modules/tickets/entities/ticket.entity");
const intermediate_airport_entity_1 = require("./modules/intermediate-airports/entities/intermediate-airport.entity");
const flight_ticket_class_entity_1 = require("./modules/flight-ticket-classes/entities/flight-ticket-class.entity");
const ticket_class_entity_1 = require("./modules/ticket-classes/entities/ticket-class.entity");
const booking_entity_1 = require("./modules/bookings/entities/booking.entity");
const user_entity_1 = require("./modules/users/entities/user.entity");
const role_permission_entity_1 = require("./modules/users/entities/role-permission.entity");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [
        airport_entity_1.Airport, airplane_entity_1.Airplane, flight_entity_1.Flight, setting_entity_1.Setting, seat_entity_1.Seat, ticket_entity_1.Ticket,
        intermediate_airport_entity_1.IntermediateAirport, flight_ticket_class_entity_1.FlightTicketClass, ticket_class_entity_1.TicketClass,
        booking_entity_1.Booking, user_entity_1.User, role_permission_entity_1.RolePermission
    ],
    synchronize: false,
    ssl: {
        rejectUnauthorized: false,
    },
});
async function seedFlightData() {
    await AppDataSource.initialize();
    const airportRepo = AppDataSource.getRepository(airport_entity_1.Airport);
    const airplaneRepo = AppDataSource.getRepository(airplane_entity_1.Airplane);
    const flightRepo = AppDataSource.getRepository(flight_entity_1.Flight);
    const settingRepo = AppDataSource.getRepository(setting_entity_1.Setting);
    console.log('🌱 Seeding Flight data...');
    let settings = await settingRepo.findOne({ where: { id: 1 } });
    if (!settings) {
        settings = settingRepo.create({
            minFlightTime: 30,
            maxIntermediateAirports: 2,
            minStopoverTime: 10,
            maxStopoverTime: 20,
            latestBookingTime: 12,
            latestCancellationTime: 1,
        });
        await settingRepo.save(settings);
        console.log('✅ Created default settings');
    }
    const airports = [
        { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP.HCM', country: 'Việt Nam' },
        { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'Việt Nam' },
        { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'Việt Nam' },
        { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'Việt Nam' },
    ];
    for (const ap of airports) {
        const exists = await airportRepo.findOne({ where: { code: ap.code } });
        if (!exists) {
            await airportRepo.save(airportRepo.create(ap));
            console.log(`✅ Created airport: ${ap.name}`);
        }
    }
    const airplanes = [
        { code: 'VN001', name: 'Boeing 787', totalSeats: 250, economySeats: 200, businessSeats: 50 },
        { code: 'VN002', name: 'Airbus A350', totalSeats: 300, economySeats: 250, businessSeats: 50 },
    ];
    for (const plane of airplanes) {
        const exists = await airplaneRepo.findOne({ where: { code: plane.code } });
        if (!exists) {
            await airplaneRepo.save(airplaneRepo.create(plane));
            console.log(`✅ Created airplane: ${plane.name}`);
        }
    }
    const fromAirport = await airportRepo.findOne({ where: { code: 'SGN' } });
    const toAirport = await airportRepo.findOne({ where: { code: 'HAN' } });
    const plane = await airplaneRepo.findOne({ where: { code: 'VN001' } });
    if (fromAirport && toAirport && plane) {
        const existingFlight = await flightRepo.findOne({ where: { flightCode: 'VN101' } });
        if (!existingFlight) {
            const startTime = new Date('2025-12-28T08:00:00');
            const endTime = new Date('2025-12-28T10:30:00');
            const duration = (endTime.getTime() - startTime.getTime()) / 60000;
            const flight = flightRepo.create({
                flightCode: 'VN101',
                startTime,
                endTime,
                duration,
                price: 1500000,
                totalSeats: plane.totalSeats,
                availableSeats: plane.totalSeats,
                status: 'active',
                fromAirport,
                toAirport,
                plane,
            });
            await flightRepo.save(flight);
            console.log('✅ Created sample flight VN101');
        }
    }
    console.log('✨ Seed completed!');
    await AppDataSource.destroy();
}
seedFlightData().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-flights.js.map