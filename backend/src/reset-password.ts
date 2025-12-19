import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './modules/users/entities/user.entity';

async function resetPassword() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'admin',
    password: 'admin',
    database: 'flight_db',
    entities: [User],
  });

  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email: 'admin@flight.com' } });

  if (user) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash('flight123456', salt);
    await userRepo.save(user);
    console.log('✅ Đã reset mật khẩu admin@flight.com về flight123456');
  } else {
    console.log('❌ Không tìm thấy user admin@flight.com');
  }

  await dataSource.destroy();
}

resetPassword();
