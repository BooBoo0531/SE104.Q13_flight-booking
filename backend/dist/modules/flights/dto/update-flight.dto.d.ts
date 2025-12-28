<<<<<<< HEAD
export declare class UpdateFlightDto {
    flightCode?: string;
    price?: number;
    totalSeats?: number;
    startTime?: string;
    endTime?: string;
    planeId?: number;
    fromAirportId?: number;
    toAirportId?: number;
    status?: string;
    duration?: number;
}
=======
import { CreateFlightDto } from './create-flight.dto';
declare const UpdateFlightDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFlightDto>>;
export declare class UpdateFlightDto extends UpdateFlightDto_base {
}
export {};
>>>>>>> origin/main
