import { Airplane } from '../../airplanes/entities/airplane.entity';
import { TicketClass } from '../../ticket-classes/entities/ticket-class.entity';
export declare class Seat {
    id: number;
    code: string;
    airplane: Airplane;
    class: TicketClass;
}
