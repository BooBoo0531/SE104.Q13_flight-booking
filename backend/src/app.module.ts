import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsModule } from './modules/flights/flights.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,

      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, 
        },
      },

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
      autoLoadEntities: true,
    }),
    FlightsModule,
    AuthModule,
  ],
})
export class AppModule {}