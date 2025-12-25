import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<import("./entities/user.entity").User[]>;
    createUser(body: any): Promise<import("./entities/user.entity").User[]>;
    deleteUser(id: string): Promise<import("typeorm").DeleteResult>;
    getPermissions(): Promise<{}>;
    savePermissions(body: any): Promise<{
        success: boolean;
    }>;
    seed(): Promise<"Đã tạo dữ liệu mẫu!" | "Dữ liệu đã có sẵn.">;
}
