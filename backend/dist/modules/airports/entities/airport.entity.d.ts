import { Flight } from '../../flights/entities/flight.entity';
export declare class Airport {
    id: number;
    name: string;
    code: string;
    city: string;
    country: string;
    departingFlights: Flight[];
    arrivingFlights: Flight[];
}
