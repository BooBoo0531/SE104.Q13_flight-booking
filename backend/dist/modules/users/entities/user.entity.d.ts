import { Booking } from '../../bookings/entities/booking.entity';
import { RolePermission } from '../../users/entities/role-permission.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: RolePermission;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    bookings: Booking[];
}
