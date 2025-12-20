import { AirplanesService } from './airplanes.service';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
import { UpdateAirplaneDto } from './dto/update-airplane.dto';
export declare class AirplanesController {
    private readonly airplanesService;
    constructor(airplanesService: AirplanesService);
    create(createAirplaneDto: CreateAirplaneDto): Promise<import("./entities/airplane.entity").Airplane>;
    findAll(): Promise<import("./entities/airplane.entity").Airplane[]>;
    update(id: string, updateAirplaneDto: UpdateAirplaneDto): Promise<import("./entities/airplane.entity").Airplane | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
