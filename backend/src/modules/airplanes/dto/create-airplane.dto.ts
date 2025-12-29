import { IsNotEmpty, IsString, IsNumber, Min, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SeatConfigDto {
  @IsNumber()
  ticketClassId: number;

  @IsString()
  name: string;

  @IsString()
  prefix: string;

  @IsNumber()
  @Min(0)
  seatCount: number;
}

export class CreateAirplaneDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNumber()
  @Min(0)
  economySeats: number;

  @IsNumber()
  @Min(0)
  businessSeats: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SeatConfigDto)
  seatConfigs?: SeatConfigDto[];
}