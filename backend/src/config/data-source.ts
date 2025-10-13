import { DataSource } from 'typeorm';
import { Flight } from '../modules/flights/entities/flight.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'flightdb',
  entities: [Flight],
  synchronize: true, // dev only; dùng migrations cho production
});
