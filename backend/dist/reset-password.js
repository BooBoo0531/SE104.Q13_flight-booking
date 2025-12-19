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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("./modules/users/entities/user.entity");
async function resetPassword() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'postgres',
        port: 5432,
        username: 'admin',
        password: 'admin',
        database: 'flight_db',
        entities: [user_entity_1.User],
    });
    await dataSource.initialize();
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const user = await userRepo.findOne({ where: { email: 'admin@flight.com' } });
    if (user) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash('flight123456', salt);
        await userRepo.save(user);
        console.log('✅ Đã reset mật khẩu admin@flight.com về flight123456');
    }
    else {
        console.log('❌ Không tìm thấy user admin@flight.com');
    }
    await dataSource.destroy();
}
resetPassword();
//# sourceMappingURL=reset-password.js.map