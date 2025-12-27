import { IsInt, IsOptional, Min } from 'class-validator';

// Map theo UI (DashboardScreen.rules)
export class UpdateSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  minFlightTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxStopovers?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minStopTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxStopTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  latestBookingTime?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  latestCancelTime?: number;
}
