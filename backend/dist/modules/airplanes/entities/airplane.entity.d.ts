import { Flight } from '../../flights/entities/flight.entity';
import { Seat } from '../../seats/entities/seat.entity';
export interface SeatConfig {
    ticketClassId: number;
    name: string;
    prefix: string;
    seatCount: number;
}
export declare class Airplane {
    id: number;
    name: string;
    code: string;
    totalSeats: number;
    economySeats: number;
    businessSeats: number;
    seatConfigs: SeatConfig[];
    flights: Flight[];
    seats: Seat[];
}
