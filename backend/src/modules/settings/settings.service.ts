import { BadRequestException, Injectable } from '@nestjs/common';
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

  /**
   * TypeORM >= 0.3: findOne() BẮT BUỘC phải có điều kiện `where`.
   * Nếu muốn lấy 1 dòng bất kỳ theo order -> dùng find({ take: 1 }) hoặc query builder.
   */
  private async ensureRow(): Promise<Setting> {
    const rows = await this.repo.find({ order: { id: 'ASC' }, take: 1 });
    if (rows.length > 0) return rows[0];

    // Chưa có dòng THAMSO -> tạo mới theo default trong đề
    const newRow = this.repo.create({
      minFlightTime: 30,
      maxIntermediateAirports: 2,
      minStopoverTime: 10,
      maxStopoverTime: 20,
      latestBookingTime: 12,
      latestCancellationTime: 1,
    });

    return this.repo.save(newRow);
  }

  /**
   * UI đang dùng các key: minFlightTime, maxStopovers, minStopTime, maxStopTime,
   * latestBookingTime, latestCancelTime.
   */
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

    const newMinStop = dto.minStopTime !== undefined ? dto.minStopTime : s.minStopoverTime;
    const newMaxStop = dto.maxStopTime !== undefined ? dto.maxStopTime : s.maxStopoverTime;

    if (newMinStop > newMaxStop) {
      throw new BadRequestException(
        'Thời gian dừng tối thiểu không được lớn hơn thời gian dừng tối đa!',
      );
    }

    s.minStopoverTime = newMinStop;
    s.maxStopoverTime = newMaxStop;

    if (dto.latestBookingTime !== undefined) s.latestBookingTime = dto.latestBookingTime;
    if (dto.latestCancelTime !== undefined) s.latestCancellationTime = dto.latestCancelTime;

    await this.repo.save(s);
    return this.getRulesForUI();
  }
}
