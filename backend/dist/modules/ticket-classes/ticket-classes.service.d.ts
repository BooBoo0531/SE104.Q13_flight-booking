import { Repository } from 'typeorm';
import { TicketClass } from './entities/ticket-class.entity';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';
export declare class TicketClassesService {
    private readonly repo;
    constructor(repo: Repository<TicketClass>);
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
