import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateFlightDto {
  @IsString() @IsNotEmpty()
  flightNumber: string;

  @IsString() @IsNotEmpty()
  origin: string;

  @IsString() @IsNotEmpty()
  destination: string;

  @IsDateString()
  departureTime: string;

  @IsInt()
  seats: number;
}
