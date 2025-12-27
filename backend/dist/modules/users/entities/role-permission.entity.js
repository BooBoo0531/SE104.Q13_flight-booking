"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
const typeorm_1 = require("typeorm");
let RolePermission = class RolePermission {
    role;
    permissions;
};
exports.RolePermission = RolePermission;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'TenNhomQuyen' }),
    __metadata("design:type", String)
], RolePermission.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'DanhSachQuyen', nullable: true }),
    __metadata("design:type", Object)
], RolePermission.prototype, "permissions", void 0);
exports.RolePermission = RolePermission = __decorate([
    (0, typeorm_1.Entity)({ name: 'PHANQUYEN' })
], RolePermission);
//# sourceMappingURL=role-permission.entity.js.map