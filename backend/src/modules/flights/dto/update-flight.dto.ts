import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFlightDto {
  @IsOptional()
  @IsString()
  flightCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalSeats?: number;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  planeId?: number;

  @IsOptional()
  @IsInt()
  fromAirportId?: number;

  @IsOptional()
  @IsInt()
  toAirportId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  // computed on server when startTime/endTime are provided
  duration?: number;
}
