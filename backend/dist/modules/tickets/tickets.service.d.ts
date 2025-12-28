import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Flight } from '../flights/entities/flight.entity';
import { TicketClass } from '../ticket-classes/entities/ticket-class.entity';
import { SettingsService } from '../settings/settings.service';
export declare class TicketsService {
    private readonly ticketRepo;
    private readonly flightRepo;
    private readonly ticketClassRepo;
    private readonly settingsService;
    constructor(ticketRepo: Repository<Ticket>, flightRepo: Repository<Flight>, ticketClassRepo: Repository<TicketClass>, settingsService: SettingsService);
    private generateTicketId;
    private normalizeKey;
    private buildSeatClassRatioMap;
    private computePriceFromSeatClass;
    private assertBookingAllowed;
    private toUI;
    private isSeatBooked;
    private validateSeatExistence;
    create(dto: CreateTicketDto): Promise<{
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
    findOneByTicketId(ticketId: string): Promise<{
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
    update(ticketId: string, dto: UpdateTicketDto): Promise<{
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
