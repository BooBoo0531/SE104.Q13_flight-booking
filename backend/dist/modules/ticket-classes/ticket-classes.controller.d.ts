import { TicketClassesService } from './ticket-classes.service';
import { CreateTicketClassDto } from './dto/create-ticket-class.dto';
import { UpdateTicketClassDto } from './dto/update-ticket-class.dto';
export declare class TicketClassesController {
    private readonly svc;
    constructor(svc: TicketClassesService);
    list(): Promise<{
        id: number;
        name: string;
        percentage: number;
    }[]>;
    create(dto: CreateTicketClassDto): Promise<{
        id: number;
        name: string;
        percentage: number;
    }>;
    update(id: string, dto: UpdateTicketClassDto): Promise<{
        id: number;
        name: string;
        percentage: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
