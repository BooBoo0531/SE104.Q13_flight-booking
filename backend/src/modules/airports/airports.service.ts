import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { Flight } from '../flights/entities/flight.entity';

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportsRepository: Repository<Airport>,
    @InjectRepository(Flight)
    private readonly flightsRepository: Repository<Flight>,
  ) {}

  findAll() {
    return this.airportsRepository.find({ order: { id: 'ASC' } });
  }

  findOne(id: number) {
    return this.airportsRepository.findOne({ where: { id } });
  }

  private slugUpper(input: string): string {
    return (input || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();
  }

  private async generateUniqueCode(name: string, city: string): Promise<string> {
    const baseRaw = this.slugUpper(city) || this.slugUpper(name) || 'AP';
    let base = baseRaw.slice(0, 3) || 'AP';

    // đảm bảo base đủ 3 ký tự nếu quá ngắn
    while (base.length < 3) base = (base + 'X').slice(0, 3);

    let code = base;
    let i = 1;
    while (await this.airportsRepository.findOne({ where: { code } })) {
      code = `${base}${i}`;
      i += 1;
      if (i > 99) break;
    }
    return code;
  }

  async create(dto: CreateAirportDto) {
    const code = dto.code?.trim() || (await this.generateUniqueCode(dto.name, dto.city));
    const exists = await this.airportsRepository.findOne({ where: { code } });
    if (exists) throw new BadRequestException('Mã sân bay đã tồn tại');

    const airport = this.airportsRepository.create({
      name: dto.name,
      city: dto.city,
      country: dto.country,
      code,
    });
    return this.airportsRepository.save(airport);
  }

  async update(id: number, dto: UpdateAirportDto) {
    const airport = await this.airportsRepository.findOne({ where: { id } });
    if (!airport) throw new BadRequestException('Không tìm thấy sân bay');

    if (dto.code && dto.code !== airport.code) {
      const exists = await this.airportsRepository.findOne({ where: { code: dto.code } });
      if (exists) throw new BadRequestException('Mã sân bay đã tồn tại');
    }

    Object.assign(airport, dto);
    return this.airportsRepository.save(airport);
  }

  async remove(id: number) {
    const airport = await this.airportsRepository.findOne({ where: { id } });
    if (!airport) throw new BadRequestException('Không tìm thấy sân bay');

    const usedCount = await this.flightsRepository.count({
      where: [{ fromAirport: { id } as any }, { toAirport: { id } as any }],
    });
    if (usedCount > 0) {
      throw new BadRequestException('Không thể xóa sân bay đang được dùng trong chuyến bay');
    }

    await this.airportsRepository.remove(airport);
    return { message: 'Xóa sân bay thành công' };
  }
}
