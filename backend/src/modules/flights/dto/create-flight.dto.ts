import { IsString, IsNotEmpty, IsInt, IsDateString, IsNumber, Min, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho sân bay trung gian
export class IntermediateAirportDto {
  @IsInt()
  @IsNotEmpty()
  airportId: number;

  @IsInt()
  @Min(10, { message: 'Thời gian dừng phải lớn hơn hoặc bằng 10 phút' })
  duration: number; 

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateFlightDto {
  // 1. Thông tin cơ bản
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
  planeId: number; // ID máy bay

  @IsInt()
  @IsNotEmpty()
  fromAirportId: number; // ID sân bay đi

  @IsInt()
  @IsNotEmpty()
  toAirportId: number; // ID sân bay đến

  // 4. Sân bay trung gian 
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IntermediateAirportDto)
  intermediateAirports?: IntermediateAirportDto[];
}