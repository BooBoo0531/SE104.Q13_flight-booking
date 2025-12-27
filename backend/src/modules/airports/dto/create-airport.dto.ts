import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  // SettingsTab không nhập code, backend tự sinh nếu thiếu
  @IsOptional()
  @IsString()
  code?: string;
}
