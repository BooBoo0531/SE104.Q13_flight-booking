import { Airplane } from '../../airplanes/entities/airplane.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Airport } from '../../airports/entities/airport.entity';
import { IntermediateAirport } from '../../intermediate-airports/entities/intermediate-airport.entity';
import { FlightTicketClass } from '../../flight-ticket-classes/entities/flight-ticket-class.entity';
export declare class Flight {
    id: number;
    flightCode: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    price: number;
    totalSeats: number;
    availableSeats: number;
    status: string;
    fromAirport: Airport;
    toAirport: Airport;
    plane: Airplane;
    tickets: Ticket[];
    intermediates: IntermediateAirport[];
    ticketClassDetails: FlightTicketClass[];
}
