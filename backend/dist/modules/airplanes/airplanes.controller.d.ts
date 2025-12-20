import { AirplanesService } from './airplanes.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
export declare class AirplanesController {
    private readonly airplanesService;
    constructor(airplanesService: AirplanesService);
    create(createAirplaneDto: CreateAirplaneDto): Promise<import("./entities/airplane.entity").Airplane>;
    findAll(): Promise<import("./entities/airplane.entity").Airplane[]>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
