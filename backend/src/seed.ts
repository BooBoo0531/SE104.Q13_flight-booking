import { AppDataSource } from './config/data-source';
import { Flight } from './modules/flights/entities/flight.entity';
import { User } from './modules/users/entities/user.entity';
import { Airport } from './modules/airports/entities/airport.entity';
import { Airplane } from './modules/airplanes/entities/airplane.entity';
import { Ticket } from './modules/tickets/entities/ticket.entity';
import { TicketClass } from './modules/ticket-classes/entities/ticket-class.entity';
import { Booking } from './modules/bookings/entities/booking.entity';
import { Setting } from './modules/settings/entities/setting.entity';
import { Seat } from './modules/seats/entities/seat.entity';
import { IntermediateAirport } from './modules/intermediate-airports/entities/intermediate-airport.entity';
import { FlightTicketClass } from './modules/flight-ticket-classes/entities/flight-ticket-class.entity';
import { RolePermission } from './modules/users/entities/role-permission.entity';

import * as bcrypt from 'bcryptjs';

// --- BỘ SINH DỮ LIỆU ---
const hoVN = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const demVN = ['Văn', 'Thị', 'Minh', 'Thanh', 'Ngọc', 'Quốc', 'Tuấn', 'Hải', 'Đức', 'Xuân', 'Thu', 'Phương', 'Hữu', 'Gia', 'Khánh'];
const tenVN = ['Anh', 'Bình', 'Châu', 'Dương', 'Em', 'Hùng', 'Huy', 'Khánh', 'Lan', 'Long', 'Mai', 'Nam', 'Nhi', 'Phúc', 'Quân', 'Sơn', 'Thảo', 'Trang', 'Tú', 'Uyên', 'Việt', 'Yến', 'Tâm', 'Thắng', 'Tài'];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
}

const generateName = () => `${getRandomItem(hoVN)} ${getRandomItem(demVN)} ${getRandomItem(tenVN)}`;
const generateEmail = (name: string, domain: string) => {
  const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/ /g, "");
  return `${cleanName}${getRandomInt(100, 9999)}@${domain}`;
};

const hashPassword = async (plain: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(plain, saltRounds);
};

async function bootstrap() {
  console.log('🚀 Bắt đầu seed database...');
  
  // XÁC NHẬN XÓA DỮ LIỆU - Bỏ comment dòng dưới nếu muốn bỏ qua xác nhận
  const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  const shouldClear = await new Promise<boolean>(resolve => {
    readline.question('⚠️  XÓA TẤT CẢ DỮ LIỆU? (yes/no): ', (answer: string) => {
      readline.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
  
  if (!shouldClear) {
    console.log('❌ Hủy seed - Dữ liệu được giữ nguyên');
    return;
  }
  
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    console.log('🗑️  Xóa dữ liệu cũ...');
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = [
      'VE', 'PHIEUDATCHO', 'CT_HANGVE', 'TRUNGGIAN', 
      'CHUYENBAY', 'GHE', 'MAYBAY', 'SANBAY', 'HANGVE', 
      'NGUOIDUNG', 'THAMSO'
    ];
    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE`);
    }

    // Repo
    const flightRepo = AppDataSource.getRepository(Flight);
    const userRepo = AppDataSource.getRepository(User);
    const airportRepo = AppDataSource.getRepository(Airport);
    const airplaneRepo = AppDataSource.getRepository(Airplane);
    const ticketRepo = AppDataSource.getRepository(Ticket);
    const classRepo = AppDataSource.getRepository(TicketClass);
    const bookingRepo = AppDataSource.getRepository(Booking);
    const settingRepo = AppDataSource.getRepository(Setting);
    const seatRepo = AppDataSource.getRepository(Seat);
    const interRepo = AppDataSource.getRepository(IntermediateAirport);
    const flightDetailRepo = AppDataSource.getRepository(FlightTicketClass);
    const rolePermRepo = AppDataSource.getRepository(RolePermission);

    // 1. TẠO THAM SỐ
    await settingRepo.save({
      minFlightTime: 30, maxIntermediateAirports: 2, minStopoverTime: 10, maxStopoverTime: 20, latestBookingTime: 12, latestCancellationTime: 24
    });

    // 2. TẠO HẠNG VÉ
    const ecoClass = await classRepo.save({ name: 'Phổ thông', priceRatio: 1.0 });
    const bizClass = await classRepo.save({ name: 'Thương gia', priceRatio: 1.5 });

    // 2.5 TẠO QUYỀN CHO CÁC VAI TRÒ
    await rolePermRepo.save([
      { role: 'Quản trị', permissions: { ChuyenBay: true, VeChuyenBay: true, BaoCao: true, MayBay: true, TaiKhoan: true, CaiDat: true } },
      { role: 'Ban giám đốc', permissions: { ChuyenBay: true, VeChuyenBay: false, BaoCao: true, MayBay: true, TaiKhoan: false, CaiDat: false } },
      { role: 'Điều hành bay', permissions: { ChuyenBay: true, VeChuyenBay: false, BaoCao: false, MayBay: true, TaiKhoan: false, CaiDat: false } },
      { role: 'Nhân viên', permissions: { ChuyenBay: false, VeChuyenBay: true, BaoCao: false, MayBay: false, TaiKhoan: false, CaiDat: false } },
    ]);

 // 3. TẠO USER
    console.log('👥 Tạo Users...');
    const defaultPassword = await hashPassword('flight123456');

    // --- Tạo Super Admin ---
    await userRepo.save({
      name: 'Super Admin',
      email: 'admin@flight.com',
      password: defaultPassword,
      // SỬA: Đổi thành object và dùng tên tiếng Việt khớp trong DB
      role: { role: 'Quản trị' } 
    });
    
    // --- Tạo Manager & Staff ---
    for (let i = 0; i < 10; i++) {
      const name = generateName();
      // Logic random: 30% là Giám đốc, 70% là Nhân viên
      const isManager = Math.random() > 0.7; 

      await userRepo.save({
        name,
        email: generateEmail(name, 'flightadmin.com'),
        password: defaultPassword,
        // SỬA: Map sang tên quyền tiếng Việt tương ứng
        role: isManager ? { role: 'Ban giám đốc' } : { role: 'Nhân viên' },
        phone: `09${getRandomInt(10000000, 99999999)}`
      });
    }

    const customers: User[] = [];
    // GIẢM TỪ 50 XUỐNG 30 KHÁCH HÀNG - đủ để test
    for (let i = 0; i < 30; i++) {
      const name = generateName();
      const user = await userRepo.save({
        name,
        email: generateEmail(name, getRandomItem(['gmail.com', 'yahoo.com'])),
        password: defaultPassword,
        role: { role: 'Nhân viên' }, 
        phone: `03${getRandomInt(10000000, 99999999)}`
      });
      customers.push(user);
    }

    // 4. TẠO SÂN BAY
    console.log('🛫 Tạo Sân bay...');
    const airports = await airportRepo.save([
      { name: 'Tân Sơn Nhất', city: 'Hồ Chí Minh', code: 'SGN', country: 'Việt Nam' },
      { name: 'Nội Bài', city: 'Hà Nội', code: 'HAN', country: 'Việt Nam' },
      { name: 'Đà Nẵng', city: 'Đà Nẵng', code: 'DAD', country: 'Việt Nam' },
      { name: 'Cam Ranh', city: 'Khánh Hòa', code: 'CXR', country: 'Việt Nam' },
      { name: 'Phú Quốc', city: 'Phú Quốc', code: 'PQC', country: 'Việt Nam' },
      { name: 'Vân Đồn', city: 'Quảng Ninh', code: 'VDO', country: 'Việt Nam' },
      { name: 'Cát Bi', city: 'Hải Phòng', code: 'HPH', country: 'Việt Nam' },
      { name: 'Cần Thơ', city: 'Cần Thơ', code: 'VCA', country: 'Việt Nam' },
      { name: 'Vinh', city: 'Nghệ An', code: 'VII', country: 'Việt Nam' },
      { name: 'Phù Cát', city: 'Bình Định', code: 'UIH', country: 'Việt Nam' },
    ]);

    // 5. TẠO MÁY BAY & GHẾ
    console.log('✈️ Tạo Máy bay & Ghế...');
    const planesData = [
      { name: 'Boeing 787-9', seats: 200, bizRows: 4, seatsPerRow: 6 }, 
      { name: 'Airbus A321neo', seats: 150, bizRows: 2, seatsPerRow: 6 },
      { name: 'Airbus A350', seats: 250, bizRows: 5, seatsPerRow: 9 },
    ];
    
    const planes: Airplane[] = [];
    // GIẢM XUỐNG 5 MÁY BAY
    for (let i = 1; i <= 5; i++) {
      const type = getRandomItem(planesData);
      const totalRows = Math.ceil(type.seats / type.seatsPerRow);
      const bizSeatsCount = type.bizRows * type.seatsPerRow;
      const ecoSeatsCount = type.seats - bizSeatsCount;

      const plane = await airplaneRepo.save({
        name: type.name, 
        code: `VN-A${getRandomInt(300, 999)}`, 
        totalSeats: type.seats, 
        economySeats: ecoSeatsCount, 
        businessSeats: bizSeatsCount,
      });
      planes.push(plane);

      const seatsToSave: any[] = [];
      const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'];
      
      for (let r = 1; r <= totalRows; r++) {
        for (let c = 0; c < type.seatsPerRow; c++) {
          if (seatsToSave.length >= type.seats) break;
          const isBiz = r <= type.bizRows;
          seatsToSave.push({
             code: `${r}${colLabels[c]}`,
             airplane: plane,
             class: isBiz ? bizClass : ecoClass
          });
        }
      }
      await seatRepo.save(seatsToSave);
    }

    // 6. TẠO CHUYẾN BAY
    console.log('🚀 Tạo Chuyến bay & Bán vé...');
    const usedFlightCodes = new Set<string>();
    let globalBookingCounter = 0;

    // GIẢM XUỐNG 15 ĐỂ CHẠY NHANH
    for (let i = 1; i <= 15; i++) {
      if (i % 5 === 0) console.log(`   ⏳ Đang tạo chuyến bay ${i}/15...`);
      let from = getRandomItem(airports);
      let to = getRandomItem(airports);
      while (from.code === to.code) to = getRandomItem(airports);
      
      const plane = getRandomItem(planes);
      
      let startTime: Date;
      const randTimeStrategy = Math.random();
      if (randTimeStrategy > 0.7) { 
        startTime = addMinutes(new Date(), getRandomInt(-180, 180)); 
      } else {
        const daysFromNow = getRandomInt(-60, 30);
        startTime = addDays(new Date(), daysFromNow);
        startTime.setHours(getRandomInt(6, 23), getRandomItem([0, 15, 30, 45]), 0);
      }
      
      const duration = getRandomInt(30, 180); 
      const endTime = new Date(startTime.getTime() + duration * 60000);
      const now = new Date();

      let flightStatus = 'scheduled'; 
      if (endTime < now) flightStatus = 'completed'; 
      else if (startTime <= now && now <= endTime) flightStatus = 'flying';    
      else {
        const rand = Math.random();
        if (rand > 0.95) flightStatus = 'cancelled';
        else if (rand > 0.9) flightStatus = 'delayed';
        else {
            const boardingTime = new Date(startTime.getTime() - 45 * 60000);
            if (now >= boardingTime) flightStatus = 'boarding';
            else flightStatus = 'scheduled';
        }
      }

      let uniqueCode = '';
      do { uniqueCode = `VN${getRandomInt(1000, 9999)}`; } while (usedFlightCodes.has(uniqueCode));
      usedFlightCodes.add(uniqueCode);

      const flight = await flightRepo.save({
        flightCode: uniqueCode,
        fromAirport: from, toAirport: to, startTime, endTime, duration,
        price: getRandomInt(6, 30) * 100000,
        totalSeats: plane.totalSeats, availableSeats: plane.totalSeats, 
        status: flightStatus, plane: plane,
      });

      if (Math.random() > 0.8) {
         let interAirport = getRandomItem(airports);
         while (interAirport.code === from.code || interAirport.code === to.code) interAirport = getRandomItem(airports);
         await interRepo.save({
            flight: flight, airport: interAirport, duration: getRandomInt(20, 45), note: 'Dừng kỹ thuật'
         });
      }

      await flightDetailRepo.save([
        { flight: flight, ticketClass: bizClass, totalSeats: plane.businessSeats, soldSeats: 0, price: Math.floor(flight.price * bizClass.priceRatio) },
        { flight: flight, ticketClass: ecoClass, totalSeats: plane.economySeats, soldSeats: 0, price: Math.floor(flight.price * ecoClass.priceRatio) }
      ]);

      if (flightStatus !== 'cancelled') {
        const fillRate = getRandomInt(30, 90) / 100;
        const seatsToSell = Math.floor(plane.totalSeats * fillRate);
        let seatsSoldSoFar = 0;
        let bizSold = 0;
        let ecoSold = 0;
        const bookingsBatch: any[] = [];
        const ticketsBatch: any[] = [];
        
        while (seatsSoldSoFar < seatsToSell) {
          const bookingUser = getRandomItem(customers);
          const ticketsInThisBooking = Math.min(getRandomInt(1, 4), seatsToSell - seatsSoldSoFar);
          
          globalBookingCounter++;
          const bookingCode = `BK${i}${globalBookingCounter}${getRandomInt(1000,9999)}`;
          const bookingStatus = (Math.random() > 0.95) ? 'cancelled' : 'confirmed';
          const bookingDate = new Date();
          
          let bookingTotal = 0;
          const tempTickets: any[] = [];
          
          for (let t = 0; t < ticketsInThisBooking; t++) {
            if (seatsSoldSoFar >= seatsToSell) break;
            let isBiz = (plane.businessSeats > bizSold) ? Math.random() > 0.9 : false;
            const selectedClass = isBiz ? bizClass : ecoClass;
            const finalPrice = Math.floor(flight.price * selectedClass.priceRatio);
            
            tempTickets.push({
              ticketId: `TK${bookingCode}${t}${getRandomInt(100,999)}`,
              seat: `${getRandomInt(1, 30)}${getRandomItem(['A','B','C','D'])}`,
              seatClass: selectedClass.name,
              price: finalPrice,
              passengerName: (t === 0) ? bookingUser.name : generateName(),
              bookingCode: bookingCode
            });

            bookingTotal += finalPrice;
            seatsSoldSoFar++;
            if (isBiz) bizSold++; else ecoSold++;
          }
          
          bookingsBatch.push({
            bookingCode: bookingCode,
            totalPrice: bookingTotal,
            status: bookingStatus,
            bookingDate: bookingDate,
            user: bookingUser,
            flight: flight,
            tickets: tempTickets
          });
        }

        // OPTIMIZED: Batch insert tất cả bookings cùng lúc
        if (bookingsBatch.length > 0) {
          const savedBookings = await bookingRepo.save(bookingsBatch.map(b => {
            const { tickets, ...bookingData } = b;
            return bookingData;
          }));
          
          // Tạo tickets với booking đã save
          for (let idx = 0; idx < bookingsBatch.length; idx++) {
            const tickets = bookingsBatch[idx].tickets;
            const savedBooking = savedBookings[idx];
            
            const ticketsToInsert = tickets.map((t: any) => ({
              ticketId: t.ticketId,
              seat: t.seat,
              seatClass: t.seatClass,
              price: t.price,
              passengerName: t.passengerName,
              flight: flight,
              booking: savedBooking
            }));
            
            ticketsBatch.push(...ticketsToInsert);
          }
          
          // OPTIMIZED: Insert tickets với chunk lớn hơn
          if (ticketsBatch.length > 0) {
            const chunkSize = 500; // Tăng từ 100 lên 500
            for (let k = 0; k < ticketsBatch.length; k += chunkSize) {
              await ticketRepo.save(ticketsBatch.slice(k, k + chunkSize));
            }
          }
        }

        // OPTIMIZED: Cập nhật availableSeats một lần
        flight.availableSeats = Math.floor(flight.totalSeats - seatsSoldSoFar);
        await flightRepo.save(flight);
        await flightDetailRepo.update({ flight: { id: flight.id }, ticketClass: { id: bizClass.id } }, { soldSeats: bizSold });
        await flightDetailRepo.update({ flight: { id: flight.id }, ticketClass: { id: ecoClass.id } }, { soldSeats: ecoSold });
      }
    }

    console.log('✅ SEED DONE - Hệ thống đã sẵn sàng!');
  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

bootstrap();