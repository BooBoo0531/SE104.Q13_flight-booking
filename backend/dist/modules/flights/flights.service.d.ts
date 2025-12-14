import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
export declare class FlightsService {
    private flightRepo;
    private settingRepo;
    constructor(flightRepo: Repository<Flight>, settingRepo: Repository<Setting>);
    create(dto: CreateFlightDto): Promise<Flight[]>;
    findAll(): Promise<Flight[]>;
    findOne(id: number): Promise<Flight | null>;
}
