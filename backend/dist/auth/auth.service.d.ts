import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            role: string;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetAdminPassword(): Promise<{
        message: string;
    }>;
}
