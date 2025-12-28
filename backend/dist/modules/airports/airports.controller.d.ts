import { AirportsService } from './airports.service';
<<<<<<< HEAD
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
=======
>>>>>>> origin/main
export declare class AirportsController {
    private readonly airportsService;
    constructor(airportsService: AirportsService);
    findAll(): Promise<import("./entities/airport.entity").Airport[]>;
    findOne(id: string): Promise<import("./entities/airport.entity").Airport | null>;
<<<<<<< HEAD
    create(dto: CreateAirportDto): Promise<import("./entities/airport.entity").Airport>;
    update(id: string, dto: UpdateAirportDto): Promise<import("./entities/airport.entity").Airport>;
    remove(id: string): Promise<{
        message: string;
    }>;
=======
>>>>>>> origin/main
}
