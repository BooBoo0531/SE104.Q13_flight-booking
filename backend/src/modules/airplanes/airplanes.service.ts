import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';

@Injectable()
export class AirplanesService {
  constructor(
    @InjectRepository(Airplane)
    private airplanesRepository: Repository<Airplane>,
  ) {}

  create(createAirplaneDto: CreateAirplaneDto) {
    const totalSeats = Number(createAirplaneDto.economySeats) + Number(createAirplaneDto.businessSeats);
    
    const newPlane = this.airplanesRepository.create({
      ...createAirplaneDto,
      totalSeats,
    });
    return this.airplanesRepository.save(newPlane);
  }

  findAll() {
    return this.airplanesRepository.find({ order: { id: 'DESC' } });
  }

  async remove(id: number) {
    await this.airplanesRepository.delete(id);
    return { deleted: true };
  }
}