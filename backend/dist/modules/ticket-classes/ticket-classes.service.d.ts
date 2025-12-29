import { Repository } from 'typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';
import { FlightTicketClass } from '../flight-ticket-classes/entities/flight-ticket-class.entity';
import { Seat } from '../seats/entities/seat.entity';
import { Flight } from '../flights/entities/flight.entity';
import { Airplane } from '../airplanes/entities/airplane.entity';
export declare class TicketClassesService {
    private readonly repo;
    private readonly flightTicketClassRepo;
    private readonly seatRepo;
    private readonly flightRepo;
    private readonly airplaneRepo;
    constructor(repo: Repository<TicketClass>, flightTicketClassRepo: Repository<FlightTicketClass>, seatRepo: Repository<Seat>, flightRepo: Repository<Flight>, airplaneRepo: Repository<Airplane>);
    private toUI;
    private normalizeRatio;
    findAll(): Promise<{
        id: number;
        name: string;
        percentage: number;
    }[]>;
    create(dto: CreateTicketClassDto): Promise<{
        id: number;
        name: string;
        percentage: number;
    }>;
    update(id: number, dto: UpdateTicketClassDto): Promise<{
        id: number;
        name: string;
        percentage: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
