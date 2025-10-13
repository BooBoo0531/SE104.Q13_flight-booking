import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
export declare class FlightsService {
    private flightRepo;
    constructor(flightRepo: Repository<Flight>);
    create(dto: CreateFlightDto): Promise<Flight[]>;
    findAll(): Promise<Flight[]>;
    findOne(id: number): Promise<Flight | null>;
}
