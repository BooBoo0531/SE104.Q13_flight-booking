import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

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
}