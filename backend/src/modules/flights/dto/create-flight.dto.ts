import { IsString, IsNotEmpty, IsInt, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateFlightDto {
  // 1. Thông tin cơ bản
  @IsString()
  @IsNotEmpty()
  flightCode: string; // Đổi từ flightNumber thành flightCode cho khớp Entity

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  totalSeats: number;

  // 2. Thời gian (Quan trọng để fix lỗi bạn vừa gặp)
  @IsDateString()
  @IsNotEmpty()
  startTime: string; // Dùng string dạng ISO (YYYY-MM-DDTHH:mm:ss)

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  // 3. Các ID quan hệ (Thay vì gửi string tên thành phố, ta gửi ID)
  
  @IsInt()
  @IsNotEmpty()
  planeId: number; // ID máy bay

  @IsInt()
  @IsNotEmpty()
  fromAirportId: number; // ID sân bay đi

  @IsInt()
  @IsNotEmpty()
  toAirportId: number; // ID sân bay đến
}