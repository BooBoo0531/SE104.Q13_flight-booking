import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airport)
    private airportsRepository: Repository<Airport>,
  ) {}

  /**
   * Lấy danh sách tất cả sân bay
   */
  findAll() {
    return this.airportsRepository.find({
      order: { id: 'ASC' },
    });
  }

  /**
   * Lấy chi tiết 1 sân bay
   */
  findOne(id: number) {
    return this.airportsRepository.findOne({
      where: { id },
    });
  }
}
