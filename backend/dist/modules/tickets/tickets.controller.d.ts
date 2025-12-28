import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketsController {
    private readonly svc;
    constructor(svc: TicketsService);
    list(): Promise<{
        ticketId: string;
        flightId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string;
        phone: string;
        email: string;
    }[]>;
    get(ticketId: string): Promise<{
        ticketId: string;
        flightId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string;
        phone: string;
        email: string;
    }>;
    create(dto: CreateTicketDto): Promise<{
        ticketId: string;
        flightId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string;
        phone: string;
        email: string;
    }>;
    update(ticketId: string, dto: UpdateTicketDto): Promise<{
        ticketId: string;
        flightId: string;
        seat: string;
        seatClass: string;
        price: number;
        name: string;
        idCard: string;
        phone: string;
        email: string;
    }>;
    remove(ticketId: string): Promise<{
        message: string;
    }>;
}
