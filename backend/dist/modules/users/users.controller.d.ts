import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<{
        role: string;
        id: number;
        name: string;
        email: string;
        password: string;
        phone: string;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: Date | null;
        bookings: import("../bookings/entities/booking.entity").Booking[];
    }[]>;
    createUser(body: any): Promise<import("./entities/user.entity").User[]>;
    deleteUser(id: string): Promise<import("typeorm").DeleteResult>;
    getPermissions(): Promise<{}>;
    savePermissions(body: any): Promise<{
        success: boolean;
    }>;
    seed(): Promise<"Đã tạo dữ liệu mẫu!" | "Dữ liệu đã có sẵn.">;
    updateUser(id: string, body: any): Promise<{
        role: string;
        id: number;
        name: string;
        email: string;
        password: string;
        phone: string;
        resetPasswordToken?: string | null;
        resetPasswordExpires?: Date | null;
        bookings: import("../bookings/entities/booking.entity").Booking[];
    }>;
}
