import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTicketClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()g
  @Min(0.000001)
  percentage?: number;
  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  priceRatio?: number;
}
