import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Flight } from '../flights/entities/flight.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketsService {
    private readonly ticketRepo;
    private readonly flightRepo;
    constructor(ticketRepo: Repository<Ticket>, flightRepo: Repository<Flight>);
    private toUI;
    private findFlightByFlightId;
    private generateUniqueTicketId;
    findAll(): Promise<{
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
    findOneByTicketId(ticketId: string): Promise<{
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
