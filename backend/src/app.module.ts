import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';

import { FlightsModule } from './modules/flights/flights.module';
import { AirplanesModule } from './modules/airplanes/airplanes.module';
import { AirportsModule } from './modules/airports/airports.module';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';

import { SettingsModule } from './modules/settings/settings.module';
import { TicketClassesModule } from './modules/ticket-classes/ticket-classes.module';
import { TicketsModule } from './modules/tickets/tickets.module';

dotenv.config();

const useSSL = (process.env.DB_SSL ?? process.env.DATABASE_SSL ?? 'true') === 'true';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: useSSL,
      extra: useSSL ? { ssl: { rejectUnauthorized: false } } : undefined,
      // ✅ Nạp tất cả entity để tránh lỗi "Entity metadata ... was not found"
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    FlightsModule,
    AirplanesModule,
    AirportsModule,
    UsersModule,
    ReportsModule,

    // ✅ Backend cho SettingsTab & TicketsTab
    SettingsModule,
    TicketClassesModule,
    TicketsModule,
  ],
})
export class AppModule {}
