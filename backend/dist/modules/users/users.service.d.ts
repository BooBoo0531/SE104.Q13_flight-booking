import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolePermission } from './entities/role-permission.entity';
export declare class UsersService {
    private usersRepo;
    private rolesRepo;
    constructor(usersRepo: Repository<User>, rolesRepo: Repository<RolePermission>);
    findAllUsers(): Promise<{
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
    createUser(data: any): Promise<User[]>;
    updateUser(id: number, data: any): Promise<{
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
    deleteUser(id: number): Promise<import("typeorm").DeleteResult>;
    getAllPermissions(): Promise<{}>;
    savePermissions(permissionsData: any): Promise<{
        success: boolean;
    }>;
    seedDefaultPermissions(): Promise<"Đã tạo dữ liệu mẫu!" | "Dữ liệu đã có sẵn.">;
}
