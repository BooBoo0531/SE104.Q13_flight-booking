import { Repository } from 'typeorm';
import { Airplane } from './entities/airplane.entity';
import { CreateAirplaneDto } from './dto/create-airplane.dto';
export declare class AirplanesService {
    private airplanesRepository;
    constructor(airplanesRepository: Repository<Airplane>);
    create(createAirplaneDto: CreateAirplaneDto): Promise<Airplane>;
    findAll(): Promise<Airplane[]>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
}
