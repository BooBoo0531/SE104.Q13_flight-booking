import { IsEmail, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{9}(\d{3})?$/, { message: 'CMND/CCCD phải là 9 số hoặc 12 số' })
  idCard?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Số điện thoại phải đúng 10 số' })
  phone?: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;
}
