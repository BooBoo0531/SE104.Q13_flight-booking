import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Flight } from '../modules/flights/entities/flight.entity';
import { User } from '../modules/users/entities/user.entity';
import { Airport } from '../modules/airports/entities/airport.entity';
import { Airplane } from '../modules/airplanes/entities/airplane.entity';
import { Ticket } from '../modules/tickets/entities/ticket.entity';
import { TicketClass } from '../modules/ticket-classes/entities/ticket-class.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { Setting } from '../modules/settings/entities/setting.entity';
import { IntermediateAirport } from '../modules/intermediate-airports/entities/intermediate-airport.entity';
import { Seat } from '../modules/seats/entities/seat.entity';
import { FlightTicketClass } from '../modules/flight-ticket-classes/entities/flight-ticket-class.entity';
import { RolePermission } from '../modules/users/entities/role-permission.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
  dropSchema: true,
  synchronize: true,
  logging: false,
  
  entities: [
    Flight, 
    User, 
    Airport, 
    Airplane, 
    Ticket,
    TicketClass,
    Booking,
    Setting,
    IntermediateAirport, 
    Seat,
    FlightTicketClass,
    RolePermission
  ],
  
  migrations: [],
  subscribers: [],
});