import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private readonly repo;
    constructor(repo: Repository<Setting>);
    private ensureRow;
    getRulesForUI(): Promise<{
        minFlightTime: number;
        maxStopovers: number;
        minStopTime: number;
        maxStopTime: number;
        latestBookingTime: number;
        latestCancelTime: number;
    }>;
    updateRulesFromUI(dto: UpdateSettingsDto): Promise<{
        minFlightTime: number;
        maxStopovers: number;
        minStopTime: number;
        maxStopTime: number;
        latestBookingTime: number;
        latestCancelTime: number;
    }>;
}
