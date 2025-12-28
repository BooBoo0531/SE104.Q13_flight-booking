import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
export declare class FlightsController {
    private readonly svc;
    constructor(svc: FlightsService);
    list(): Promise<import("./entities/flight.entity").Flight[]>;
    adminRoute(): string;
    get(id: string): Promise<import("./entities/flight.entity").Flight | null>;
    create(dto: CreateFlightDto): Promise<import("./entities/flight.entity").Flight[]>;
    update(id: string, dto: CreateFlightDto): Promise<import("./entities/flight.entity").Flight>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
