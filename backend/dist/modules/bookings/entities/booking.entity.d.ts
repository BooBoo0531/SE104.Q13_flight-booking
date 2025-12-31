import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
export declare class Booking {
    id: number;
    bookingCode: string;
    bookingDate: Date;
    status: string;
    totalPrice: number;
    user: User;
    tickets: Ticket[];
}
