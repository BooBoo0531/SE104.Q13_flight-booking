import { Flight } from '../../flights/entities/flight.entity';
import { Seat } from '../../seats/entities/seat.entity';
export declare class Airplane {
    id: number;
    name: string;
    code: string;
    totalSeats: number;
    economySeats: number;
    businessSeats: number;
    flights: Flight[];
    seats: Seat[];
}
