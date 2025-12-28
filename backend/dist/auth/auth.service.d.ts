import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { EmailService } from './email.service';
export declare class AuthService {
    private userRepo;
    private jwtService;
    private emailService;
    constructor(userRepo: Repository<User>, jwtService: JwtService, emailService: EmailService);
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
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    resetAdminPassword(): Promise<{
        message: string;
    }>;
}
