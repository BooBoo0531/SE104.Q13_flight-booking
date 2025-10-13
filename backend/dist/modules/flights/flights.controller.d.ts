import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
export declare class FlightsController {
    private readonly svc;
    constructor(svc: FlightsService);
    create(dto: CreateFlightDto): Promise<import("./entities/flight.entity").Flight[]>;
    list(): Promise<import("./entities/flight.entity").Flight[]>;
    get(id: string): Promise<import("./entities/flight.entity").Flight | null>;
}
