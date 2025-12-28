import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTicketClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  percentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceRatio?: number;
}
