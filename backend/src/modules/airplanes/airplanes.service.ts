import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airplane, SeatConfig } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

@Injectable()
export class AirplanesService {
  constructor(
    @InjectRepository(Airplane)
    private airplanesRepository: Repository<Airplane>,
  ) {}

  create(createAirplaneDto: CreateAirplaneDto) {
    const { seatConfigs = [], ...rest } = createAirplaneDto;

    const normalizedSeatConfigs = this.normalizeSeatConfigs(seatConfigs, rest);
    const totalSeats = this.computeTotalSeats(normalizedSeatConfigs, rest);
    const { economySeats, businessSeats } = this.deriveLegacySeats(normalizedSeatConfigs, rest);
    
    const newPlane = this.airplanesRepository.create({
      ...rest,
      seatConfigs: normalizedSeatConfigs,
      totalSeats,
      economySeats,
      businessSeats,
    });
    return this.airplanesRepository.save(newPlane);
  }

  findAll() {
    return this.airplanesRepository.find({ order: { id: 'DESC' } }).then(planes => {
      // Ensure seatConfigs are returned (default to legacy if not set)
      return planes.map(plane => {
        if (!plane.seatConfigs || plane.seatConfigs.length === 0) {
          // Tạo prefix từ chữ cái đầu của tên hạng
          const econPrefix = this.buildPrefix('', 'Phổ thông', new Set());
          const bizPrefix = this.buildPrefix('', 'Thương gia', new Set([econPrefix]));
          plane.seatConfigs = [
            { ticketClassId: 0, name: 'Phổ thông', prefix: econPrefix, seatCount: plane.economySeats },
            { ticketClassId: 1, name: 'Thương gia', prefix: bizPrefix, seatCount: plane.businessSeats },
          ];
        }
        return plane;
      });
    });
  }

  async remove(id: number) {
    await this.airplanesRepository.delete(id);
    return { deleted: true };
  }

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    const { seatConfigs = [], ...rest } = updateAirplaneDto;

    const normalizedSeatConfigs = this.normalizeSeatConfigs(seatConfigs, rest);
    const totalSeats = this.computeTotalSeats(normalizedSeatConfigs, rest);
    const { economySeats, businessSeats } = this.deriveLegacySeats(normalizedSeatConfigs, rest);

    await this.airplanesRepository.update(id, {
      ...rest,
      seatConfigs: normalizedSeatConfigs,
      totalSeats,
      economySeats,
      businessSeats,
    });

    return this.airplanesRepository.findOneBy({ id });
  }

  // ---------- Helpers ----------
  private normalizeSeatConfigs(raw: any[] = [], fallback: any): SeatConfig[] {
    if (!Array.isArray(raw) || raw.length === 0) {
      // fallback to legacy 2 classes - dùng chữ cái đầu thay vì E/B
      const seen = new Set<string>();
      const econPrefix = this.buildPrefix('', 'Phổ thông', seen);
      seen.add(econPrefix);
      const bizPrefix = this.buildPrefix('', 'Thương gia', seen);
      return [
        { ticketClassId: 0, name: 'Phổ thông', prefix: econPrefix, seatCount: Number(fallback?.economySeats ?? 0) },
        { ticketClassId: 1, name: 'Thương gia', prefix: bizPrefix, seatCount: Number(fallback?.businessSeats ?? 0) },
      ];
    }

    const seen = new Set<string>();
    return raw.map((item, idx) => {
      const name = (item?.name ?? '').toString().trim() || `Hang ${idx + 1}`;
      const prefix = this.buildPrefix(item?.prefix, name, seen);
      const seatCount = Number(item?.seatCount ?? 0) || 0;
      const ticketClassId = Number(item?.ticketClassId ?? idx);
      seen.add(prefix);
      return { ticketClassId, name, prefix, seatCount };
    });
  }

  private buildPrefix(prefix: any, name: string, seen: Set<string>): string {
    let p = (prefix ?? '').toString().trim().toUpperCase();
    if (!p) {
      // Lấy chữ cái đầu tiên của tên hạng vé (normalize để bỏ dấu tiếng Việt)
      const normalized = name
        .normalize('NFD')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
      p = normalized.charAt(0) || 'X';
    }
    if (seen.has(p)) {
      let i = 2;
      let candidate = `${p}${i}`;
      while (seen.has(candidate)) {
        i += 1;
        candidate = `${p}${i}`;
      }
      p = candidate;
    }
    return p;
  }

  private computeTotalSeats(seatConfigs: SeatConfig[], fallback: any): number {
    const total = seatConfigs.reduce((sum, c) => sum + (Number(c.seatCount) || 0), 0);
    if (total > 0) return total;
    return Number(fallback?.economySeats ?? 0) + Number(fallback?.businessSeats ?? 0);
  }

  private deriveLegacySeats(seatConfigs: SeatConfig[], fallback: any): { economySeats: number; businessSeats: number } {
    const economy = seatConfigs.find((c) => /PHO\s*THONG|ECONOMY/i.test(c.name || '')) || seatConfigs.find((c) => c.prefix === 'P');
    const business = seatConfigs.find((c) => /THUONG\s*GIA|BUSINESS/i.test(c.name || '')) || seatConfigs.find((c) => c.prefix === 'T');
    return {
      economySeats: economy ? Number(economy.seatCount) || 0 : Number(fallback?.economySeats ?? 0),
      businessSeats: business ? Number(business.seatCount) || 0 : Number(fallback?.businessSeats ?? 0),
    };
  }
}