import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';

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

  async update(id: number, updateAirplaneDto: UpdateAirplaneDto) {
    const economy = Number(updateAirplaneDto.economySeats);
    const business = Number(updateAirplaneDto.businessSeats);
    const totalSeats = economy + business;

    await this.airplanesRepository.update(id, {
      ...updateAirplaneDto,
      totalSeats,
    });

    return this.airplanesRepository.findOneBy({ id });
  }
}