import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
export declare class FlightsService {
    private readonly flightRepo;
    private readonly settingRepo;
    constructor(flightRepo: Repository<Flight>, settingRepo: Repository<Setting>);
    create(dto: CreateFlightDto): Promise<Flight>;
    findAll(): Promise<Flight[]>;
    findOne(id: number): Promise<Flight | null>;
    update(id: number, dto: UpdateFlightDto): Promise<Flight>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
