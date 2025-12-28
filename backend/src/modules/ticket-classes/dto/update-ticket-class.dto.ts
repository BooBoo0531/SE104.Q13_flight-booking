import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTicketClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  percentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  priceRatio?: number;
}
