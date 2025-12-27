import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly repo: Repository<Setting>,
  ) {}

  private async ensureRow(): Promise<Setting> {
    let row = await this.repo.findOne({ where: { id: 1 } });
    if (!row) {
      row = this.repo.create({
        id: 1,
        minFlightTime: 30,
        maxIntermediateAirports: 2,
        minStopoverTime: 10,
        maxStopoverTime: 20,
        latestBookingTime: 1,
        latestCancellationTime: 1,
      });
      row = await this.repo.save(row);
    }
    return row;
  }

  async getRulesForUI() {
    const s = await this.ensureRow();
    return {
      minFlightTime: s.minFlightTime,
      maxStopovers: s.maxIntermediateAirports,
      minStopTime: s.minStopoverTime,
      maxStopTime: s.maxStopoverTime,
      latestBookingTime: s.latestBookingTime,
      latestCancelTime: s.latestCancellationTime,
    };
  }

  async updateRulesFromUI(dto: UpdateSettingsDto) {
    const s = await this.ensureRow();

    if (dto.minFlightTime !== undefined) s.minFlightTime = dto.minFlightTime;
    if (dto.maxStopovers !== undefined) s.maxIntermediateAirports = dto.maxStopovers;
    if (dto.minStopTime !== undefined) s.minStopoverTime = dto.minStopTime;
    if (dto.maxStopTime !== undefined) s.maxStopoverTime = dto.maxStopTime;
    if (dto.latestBookingTime !== undefined) s.latestBookingTime = dto.latestBookingTime;
    if (dto.latestCancelTime !== undefined)
      s.latestCancellationTime = dto.latestCancelTime;

    await this.repo.save(s);
    return this.getRulesForUI();
  }
}
