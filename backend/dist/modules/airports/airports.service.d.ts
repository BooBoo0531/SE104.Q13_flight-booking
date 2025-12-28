import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
export declare class AirportsService {
    private airportsRepository;
    constructor(airportsRepository: Repository<Airport>);
    findAll(): Promise<Airport[]>;
    findOne(id: number): Promise<Airport | null>;
}
