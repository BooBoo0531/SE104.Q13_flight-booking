import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly svc;
    constructor(svc: SettingsService);
    getRules(): Promise<{
        minFlightTime: number;
        maxStopovers: number;
        minStopTime: number;
        maxStopTime: number;
        latestBookingTime: number;
        latestCancelTime: number;
    }>;
    updateRules(dto: UpdateSettingsDto): Promise<{
        minFlightTime: number;
        maxStopovers: number;
        minStopTime: number;
        maxStopTime: number;
        latestBookingTime: number;
        latestCancelTime: number;
    }>;
    replaceRules(dto: UpdateSettingsDto): Promise<{
        minFlightTime: number;
        maxStopovers: number;
        minStopTime: number;
        maxStopTime: number;
        latestBookingTime: number;
        latestCancelTime: number;
    }>;
}
