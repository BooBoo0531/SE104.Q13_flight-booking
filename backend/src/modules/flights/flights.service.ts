import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async create(dto: CreateFlightDto) {
    const settings = await this.settingRepo.findOne({ where: { id: 1 } });
    const minFlightTime = settings ? settings.minFlightTime : 30;

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    if (endTime.getTime() <= startTime.getTime()) {
      throw new BadRequestException(
        'Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!',
      );
    }

    const duration = (endTime.getTime() - startTime.getTime()) / 60000;
    if (duration < minFlightTime) {
      throw new BadRequestException(
        `Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(
          duration,
        )} phút). Tối thiểu phải là ${minFlightTime} phút.`,
      );
    }

    const newFlight = this.flightRepo.create({
      ...dto,
      duration,
      availableSeats: dto.totalSeats,
      plane: dto.planeId ? ({ id: dto.planeId } as any) : undefined,
      fromAirport: dto.fromAirportId ? ({ id: dto.fromAirportId } as any) : undefined,
      toAirport: dto.toAirportId ? ({ id: dto.toAirportId } as any) : undefined,
    });
    return await this.flightRepo.save(newFlight);
  }

  async findAll() {
    return await this.flightRepo.find({
      relations: ['plane', 'fromAirport', 'toAirport'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number) {
    return await this.flightRepo.findOne({
      where: { id },
      relations: ['plane', 'fromAirport', 'toAirport', 'tickets'],
    });
  }

  async update(id: number, dto: UpdateFlightDto) {
    const flight = await this.flightRepo.findOne({ where: { id } });
    if (!flight) throw new BadRequestException('Không tìm thấy chuyến bay');

    if (dto.startTime && dto.endTime) {
      const startTime = new Date(dto.startTime);
      const endTime = new Date(dto.endTime);
      if (endTime.getTime() <= startTime.getTime()) {
        throw new BadRequestException(
          'Thời gian hạ cánh phải sau thời gian cất cánh!',
        );
      }
      const duration = (endTime.getTime() - startTime.getTime()) / 60000;
      const settings = await this.settingRepo.findOne({ where: { id: 1 } });
      const minFlightTime = settings ? settings.minFlightTime : 30;
      if (duration < minFlightTime) {
        throw new BadRequestException(
          `Thời gian bay quá ngắn (${Math.floor(
            duration,
          )} phút). Tối thiểu: ${minFlightTime} phút.`,
        );
      }
      dto.duration = duration;
    }

    const ticketsSold = flight.totalSeats - flight.availableSeats;

    Object.assign(flight, {
      ...dto,
      plane: dto.planeId ? ({ id: dto.planeId } as any) : flight.plane,
      fromAirport: dto.fromAirportId
        ? ({ id: dto.fromAirportId } as any)
        : flight.fromAirport,
      toAirport: dto.toAirportId
        ? ({ id: dto.toAirportId } as any)
        : flight.toAirport,
    });

    if (dto.totalSeats !== undefined) {
      flight.availableSeats = dto.totalSeats - ticketsSold;
    }

    return await this.flightRepo.save(flight);
  }

  async remove(id: number) {
    const flight = await this.flightRepo.findOne({
      where: { id },
      relations: ['tickets'],
    });
    if (!flight) throw new BadRequestException('Không tìm thấy chuyến bay');
    if (flight.tickets && flight.tickets.length > 0) {
      throw new BadRequestException('Không thể xóa chuyến bay đã có vé được đặt');
    }
    await this.flightRepo.remove(flight);
    return { message: 'Xóa chuyến bay thành công' };
  }
}
