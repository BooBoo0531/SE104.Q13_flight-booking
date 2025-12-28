import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): Promise<{
        ticketId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string | undefined;
        phone: string | undefined;
        email: string | undefined;
        flightId: string;
        bookingId: any;
    }>;
    findAll(): Promise<{
        ticketId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string | undefined;
        phone: string | undefined;
        email: string | undefined;
        flightId: string;
        bookingId: any;
    }[]>;
    findOne(ticketId: string): Promise<{
        ticketId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string | undefined;
        phone: string | undefined;
        email: string | undefined;
        flightId: string;
        bookingId: any;
    }>;
    update(ticketId: string, updateTicketDto: UpdateTicketDto): Promise<{
        ticketId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string | undefined;
        phone: string | undefined;
        email: string | undefined;
        flightId: string;
        bookingId: any;
    }>;
    remove(ticketId: string): Promise<{
        message: string;
    }>;
}
