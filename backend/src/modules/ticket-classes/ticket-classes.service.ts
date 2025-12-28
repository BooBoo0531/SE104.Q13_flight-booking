import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';

@Injectable()
export class TicketClassesService {
  constructor(
    @InjectRepository(TicketClass)
    private readonly repo: Repository<TicketClass>,
  ) {}

  private toUI(entity: TicketClass) {
    return {
      id: entity.id,
      name: entity.name,
      percentage: Math.round((entity.priceRatio ?? 1) * 100),
    };
  }

  private normalizeRatio(dto: { percentage?: number; priceRatio?: number }) {
    if (dto.priceRatio !== undefined) return dto.priceRatio;
    if (dto.percentage !== undefined) return dto.percentage / 100;
    return undefined;
  }

  async findAll() {
    const rows = await this.repo.find({ order: { id: 'ASC' } });
    return rows.map((r) => this.toUI(r));
  }

  async create(dto: CreateTicketClassDto) {
    const ratio = this.normalizeRatio(dto);
    if (ratio === undefined) {
      throw new BadRequestException('Thiếu tỷ lệ giá (percentage/priceRatio)');
    }
    const row = this.repo.create({ name: dto.name, priceRatio: ratio });
    const saved = await this.repo.save(row);
    return this.toUI(saved);
  }

  async update(id: number, dto: UpdateTicketClassDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new BadRequestException('Không tìm thấy hạng vé');

    if (dto.name !== undefined) row.name = dto.name;
    const ratio = this.normalizeRatio(dto);
    if (ratio !== undefined) row.priceRatio = ratio;
    const saved = await this.repo.save(row);
    return this.toUI(saved);
  }

  async remove(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new BadRequestException('Không tìm thấy hạng vé');
    await this.repo.remove(row);
    return { message: 'Xóa hạng vé thành công' };
  }
}