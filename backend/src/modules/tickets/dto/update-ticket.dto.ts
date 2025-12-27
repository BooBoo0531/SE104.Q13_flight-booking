import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTicketDto {
  // Không cho đổi chuyến bay từ UI (select bị disabled), nhưng để optional
  @IsOptional()
  @IsString()
  flightId?: string;

  @IsOptional()
  @IsString()
  seat?: string;

  @IsOptional()
  @IsString()
  seatClass?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  idCard?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;
}