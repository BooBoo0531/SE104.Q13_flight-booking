import { Flight } from '../../flights/entities/flight.entity';
import { Airport } from '../../airports/entities/airport.entity';
export declare class IntermediateAirport {
    id: number;
    flight: Flight;
    airport: Airport;
    duration: number;
    note: string;
}
