"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../modules/users/entities/user.entity");
const email_service_1 = require("./email.service");
let AuthService = class AuthService {
    userRepo;
    jwtService;
    emailService;
    constructor(userRepo, jwtService, emailService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async login(email, password) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Email không tồn tại');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Sai mật khẩu');
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        };
    }
    async forgotPassword(email) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Email không tồn tại trong hệ thống');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 900000);
        await this.userRepo.save(user);
        try {
            await this.emailService.sendResetPasswordEmail(email, resetToken);
            return {
                message: 'Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
            };
        }
        catch (error) {
            console.error('Error sending email:', error);
            return {
                message: 'Link khôi phục đã được tạo. Kiểm tra console để lấy link (DEV MODE).',
            };
        }
    }
    async resetPassword(token, newPassword) {
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await this.userRepo.findOne({
            where: {
                resetPasswordToken: hashedToken,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token không hợp lệ hoặc đã hết hạn');
        }
        if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Token đã hết hạn');
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepo.save(user);
        return {
            message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.',
        };
    }
    async resetAdminPassword() {
        const user = await this.userRepo.findOne({ where: { email: 'admin@flight.com' } });
        if (!user) {
            throw new common_1.UnauthorizedException('Không tìm thấy admin@flight.com');
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash('flight123456', salt);
        await this.userRepo.save(user);
        return { message: 'Đã reset mật khẩu admin@flight.com về flight123456' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map