import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho sân bay trung gian
export class IntermediateAirportDto {
  @IsInt()
  airportId: number;

  @IsInt()
  @Min(1, { message: 'Thời gian dừng phải là số dương' })
  duration: number; 

  @IsString()
  @IsOptional()
  note?: string;
}

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IntermediateAirportDto)
  intermediateAirports?: IntermediateAirportDto[];

  // computed on server when startTime/endTime are provided
  duration?: number;
}