import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightCode: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsInt()
  @IsNotEmpty()
  planeId: number;

  @IsInt()
  @IsNotEmpty()
  fromAirportId: number;

  @IsInt()
  @IsNotEmpty()
  toAirportId: number;
}
