import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFlightDto } from './dto/create-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,
  ) {}

  create(dto: CreateFlightDto) {
    const f = this.flightRepo.create(dto as any);
    return this.flightRepo.save(f);
  }

  findAll() {
    return this.flightRepo.find();
  }

  findOne(id: number) {
    return this.flightRepo.findOneBy({ id });
  }
}
