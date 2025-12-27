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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    usersRepo;
    rolesRepo;
    constructor(usersRepo, rolesRepo) {
        this.usersRepo = usersRepo;
        this.rolesRepo = rolesRepo;
    }
    async findAllUsers() {
        return this.usersRepo.find({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
            order: { id: 'DESC' }
        });
    }
    async createUser(data) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const newUser = this.usersRepo.create({ ...data, password: hashedPassword });
        return this.usersRepo.save(newUser);
    }
    async updateUser(id, data) {
        const user = await this.usersRepo.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        if (data.password && data.password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }
        else {
            delete data.password;
        }
        await this.usersRepo.update(id, data);
        return this.usersRepo.findOneBy({ id });
    }
    async deleteUser(id) {
        return this.usersRepo.delete(id);
    }
    async getAllPermissions() {
        const roles = await this.rolesRepo.find();
        const result = {};
        roles.forEach(r => { result[r.role] = r.permissions; });
        return result;
    }
    async savePermissions(permissionsData) {
        const entities = [];
        for (const [roleName, perms] of Object.entries(permissionsData)) {
            entities.push({ role: roleName, permissions: perms });
        }
        await this.rolesRepo.save(entities);
        return { success: true };
    }
    async seedDefaultPermissions() {
        const count = await this.rolesRepo.count();
        if (count === 0) {
            await this.rolesRepo.save([
                { role: 'Quản trị hệ thống', permissions: { ChuyenBay: true, VeChuyenBay: true, BaoCao: true, MayBay: true, TaiKhoan: true, CaiDat: true } },
                { role: 'Ban giám đốc', permissions: { ChuyenBay: false, VeChuyenBay: false, BaoCao: true, MayBay: false, TaiKhoan: false, CaiDat: true } },
                { role: 'Điều hành bay', permissions: { ChuyenBay: true, VeChuyenBay: false, BaoCao: false, MayBay: true, TaiKhoan: false, CaiDat: false } },
                { role: 'Nhân viên bán vé', permissions: { ChuyenBay: false, VeChuyenBay: true, BaoCao: false, MayBay: false, TaiKhoan: false, CaiDat: false } },
            ]);
            return "Đã tạo dữ liệu mẫu!";
        }
        return "Dữ liệu đã có sẵn.";
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map