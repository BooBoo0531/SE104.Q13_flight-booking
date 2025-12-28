import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { IntermediateAirport } from '../intermediate-airports/entities/intermediate-airport.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
export declare class FlightsService {
    private flightRepo;
    private settingRepo;
    private intermediateRepo;
    constructor(flightRepo: Repository<Flight>, settingRepo: Repository<Setting>, intermediateRepo: Repository<IntermediateAirport>);
    create(dto: CreateFlightDto): Promise<Flight[]>;
    findAll(): Promise<Flight[]>;
    findOne(id: number): Promise<Flight | null>;
    update(id: number, dto: CreateFlightDto): Promise<Flight>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
