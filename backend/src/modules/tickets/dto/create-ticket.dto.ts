import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTicketDto {
  // UI gửi flightId = flightCode (vd: FL0069)
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @IsOptional()
  @IsString()
  ticketId?: string;

  @IsString()
  @IsNotEmpty()
  seat: string;

  @IsString()
  @IsNotEmpty()
  seatClass: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  name: string;

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
