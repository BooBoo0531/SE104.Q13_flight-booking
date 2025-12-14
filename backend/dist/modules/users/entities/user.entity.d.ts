import { Booking } from '../../bookings/entities/booking.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    bookings: Booking[];
}
