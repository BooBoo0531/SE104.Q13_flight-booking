import { Flight } from '../../flights/entities/flight.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Ticket {
    id: number;
    ticketId: string;
    seat: string;
    seatClass: string;
    price: number;
    passengerName: string;
    flight: Flight;
    booking: Booking;
}
