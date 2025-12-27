import { DataSource } from 'typeorm';
import { Airport } from './modules/airports/entities/airport.entity';
import { Airplane } from './modules/airplanes/entities/airplane.entity';
import { Flight } from './modules/flights/entities/flight.entity';
import { Setting } from './modules/settings/entities/setting.entity';
import { Seat } from './modules/seats/entities/seat.entity';
import { Ticket } from './modules/tickets/entities/ticket.entity';
import { IntermediateAirport } from './modules/intermediate-airports/entities/intermediate-airport.entity';
import { FlightTicketClass } from './modules/flight-ticket-classes/entities/flight-ticket-class.entity';
import { TicketClass } from './modules/ticket-classes/entities/ticket-class.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { User } from './modules/users/entities/user.entity';
import { RolePermission } from './modules/users/entities/role-permission.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Airport, Airplane, Flight, Setting, Seat, Ticket, 
    IntermediateAirport, FlightTicketClass, TicketClass, 
    Booking, User, RolePermission
  ],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seedFlightData() {
  await AppDataSource.initialize();
  
  const airportRepo = AppDataSource.getRepository(Airport);
  const airplaneRepo = AppDataSource.getRepository(Airplane);
  const flightRepo = AppDataSource.getRepository(Flight);
  const settingRepo = AppDataSource.getRepository(Setting);

  console.log('🌱 Seeding Flight data...');

  // 1. Seed Settings nếu chưa có
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

  // 2. Seed Airports
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

  // 3. Seed Airplanes
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

  // 4. Seed Flights
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
