import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{9}(\d{3})?$/, { message: 'CMND/CCCD phải là 9 số hoặc 12 số' })
  idCard: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Số điện thoại phải đúng 10 số' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}
