import { AirportsService } from './airports.service';
export declare class AirportsController {
    private readonly airportsService;
    constructor(airportsService: AirportsService);
    findAll(): Promise<import("./entities/airport.entity").Airport[]>;
    findOne(id: string): Promise<import("./entities/airport.entity").Airport | null>;
}
