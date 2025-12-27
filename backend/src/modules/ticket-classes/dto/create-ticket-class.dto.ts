import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTicketClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // UI dùng percentage (vd: 105)
  @IsOptional()
  @IsNumber()
  @Min(0)
  percentage?: number;

  // Nếu muốn gửi trực tiếp ratio (vd: 1.05) cũng được
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceRatio?: number;
}