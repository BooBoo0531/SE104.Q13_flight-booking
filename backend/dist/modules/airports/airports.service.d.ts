import { Repository } from 'typeorm';
import { Airport } from './entities/airport.entity';
<<<<<<< HEAD
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { Flight } from '../flights/entities/flight.entity';
export declare class AirportsService {
    private readonly airportsRepository;
    private readonly flightsRepository;
    constructor(airportsRepository: Repository<Airport>, flightsRepository: Repository<Flight>);
    findAll(): Promise<Airport[]>;
    findOne(id: number): Promise<Airport | null>;
    private slugUpper;
    private generateUniqueCode;
    create(dto: CreateAirportDto): Promise<Airport>;
    update(id: number, dto: UpdateAirportDto): Promise<Airport>;
    remove(id: number): Promise<{
        message: string;
    }>;
=======
export declare class AirportsService {
    private airportsRepository;
    constructor(airportsRepository: Repository<Airport>);
    findAll(): Promise<Airport[]>;
    findOne(id: number): Promise<Airport | null>;
>>>>>>> origin/main
}
