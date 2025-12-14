import { Flight } from '../../flights/entities/flight.entity';
import { TicketClass } from '../../ticket-classes/entities/ticket-class.entity';
export declare class FlightTicketClass {
    id: number;
    flight: Flight;
    ticketClass: TicketClass;
    price: number;
    totalSeats: number;
    soldSeats: number;
}
