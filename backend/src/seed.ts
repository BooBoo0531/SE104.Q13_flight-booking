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

async function bootstrap() {
  try {
    console.log('🌱 Đang kết nối Database...');
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    
    console.log('🧹 Đang dọn dẹp dữ liệu cũ...');
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Danh sách bảng (Tên Tiếng Việt)
    const tables = [
      'VE', 'PHIEUDATCHO', 'CT_HANGVE', 'TRUNGGIAN', 
      'CHUYENBAY', 'GHE', 'MAYBAY', 'SANBAY', 'HANGVE', 
      'NGUOIDUNG', 'THAMSO'
    ];
    
    for (const table of tables) {
      // Thêm truy vấn check bảng tồn tại để tránh lỗi lần đầu chạy
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

    // 1. TẠO THAM SỐ
    console.log('⚙️ Thiết lập Quy định...');
    const rules = await settingRepo.save({
      minFlightTime: 30, maxIntermediateAirports: 2, minStopoverTime: 10, maxStopoverTime: 20, latestBookingTime: 12, latestCancellationTime: 24
    });

    // 2. TẠO HẠNG VÉ
    console.log('🎫 Tạo Hạng vé...');
    const ecoClass = await classRepo.save({ name: 'Phổ thông', priceRatio: 1.0 });
    const bizClass = await classRepo.save({ name: 'Thương gia', priceRatio: 1.5 });

    // 3. TẠO USER
    console.log('👥 Tạo User...');
    await userRepo.save({ name: 'Super Admin', email: 'admin@flight.com', password: '123', role: 'admin' });
    
    for (let i = 0; i < 10; i++) {
      const name = generateName();
      await userRepo.save({ name: name, email: generateEmail(name, 'flightadmin.com'), password: '123', role: Math.random() > 0.7 ? 'manager' : 'staff', phone: `09${getRandomInt(10000000, 99999999)}` });
    }
    
    const customers: User[] = [];
    for (let i = 0; i < 50; i++) {
      const name = generateName();
      const user = await userRepo.save({ name: name, email: generateEmail(name, getRandomItem(['gmail.com', 'yahoo.com'])), password: '123', role: 'user', phone: `03${getRandomInt(10000000, 99999999)}` });
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

    // 5. TẠO MÁY BAY & GHẾ (Dùng Batch Save để tránh lỗi Connection)
    console.log('✈️ Tạo Đội bay & Ghế vật lý...');
    const planesData = [
      { name: 'Boeing 787-9', seats: 200, bizRows: 4, seatsPerRow: 6 }, 
      { name: 'Airbus A321neo', seats: 150, bizRows: 2, seatsPerRow: 6 },
      { name: 'Airbus A350', seats: 250, bizRows: 5, seatsPerRow: 9 },
    ];
    
    const planes: Airplane[] = [];
    for (let i = 1; i <= 15; i++) {
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

      // 👉 BATCH INSERT: Gom ghế lại lưu 1 lần
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

    // 6. TẠO 80 CHUYẾN BAY
    console.log('🚀 Đang tạo 80 Chuyến bay (Đã tối ưu Batch Insert)...');
    
    const usedFlightCodes = new Set<string>();

    for (let i = 1; i <= 80; i++) {
      let from = getRandomItem(airports);
      let to = getRandomItem(airports);
      while (from.code === to.code) to = getRandomItem(airports);
      
      const plane = getRandomItem(planes);
      
      // Logic Time
      let startTime: Date;
      const randTimeStrategy = Math.random();
      if (randTimeStrategy > 0.7) { 
        startTime = addMinutes(new Date(), getRandomInt(-180, 180)); 
      } else {
        const daysFromNow = getRandomInt(-60, 30);
        startTime = addDays(new Date(), daysFromNow);
        startTime.setHours(getRandomInt(6, 23), getRandomItem([0, 15, 30, 45]), 0);
      }
      
      const duration = getRandomInt(rules.minFlightTime, 180); 
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

      // Unique Code
      let uniqueCode = '';
      do { uniqueCode = `VN${getRandomInt(1000, 9999)}`; } while (usedFlightCodes.has(uniqueCode));
      usedFlightCodes.add(uniqueCode);

      // Lưu Chuyến bay
      const flight = await flightRepo.save({
        flightCode: uniqueCode,
        fromAirport: from, toAirport: to, startTime, endTime, duration,
        price: getRandomInt(6, 30) * 100000,
        totalSeats: plane.totalSeats, availableSeats: plane.totalSeats, 
        status: flightStatus, plane: plane,
      });

      // Trung Gian (Chỉ 20% có để giảm load)
      if (Math.random() > 0.8) {
         let interAirport = getRandomItem(airports);
         while (interAirport.code === from.code || interAirport.code === to.code) interAirport = getRandomItem(airports);
         await interRepo.save({
            flight: flight, airport: interAirport, duration: getRandomInt(20, 45), note: 'Dừng kỹ thuật'
         });
      }

      // CT_HANGVE
      await flightDetailRepo.save([
        { flight: flight, ticketClass: bizClass, totalSeats: plane.businessSeats, soldSeats: 0, price: Math.floor(flight.price * bizClass.priceRatio) },
        { flight: flight, ticketClass: ecoClass, totalSeats: plane.economySeats, soldSeats: 0, price: Math.floor(flight.price * ecoClass.priceRatio) }
      ]);

      // --- LOGIC BÁN VÉ (ĐÃ TỐI ƯU BATCH INSERT) ---
      if (flightStatus !== 'cancelled') {
        const fillRate = getRandomInt(30, 90) / 100;
        const seatsToSell = Math.floor(plane.totalSeats * fillRate);
        let seatsSoldSoFar = 0;
        let bizSold = 0;
        let ecoSold = 0;
        
        // Mảng chứa vé chờ lưu (Gom lại lưu 1 lần)
        const ticketsBatch: any[] = []; 
        
        // Vòng lặp tạo Booking và gom Vé
        while (seatsSoldSoFar < seatsToSell) {
          const bookingUser = getRandomItem(customers);
          const ticketsInThisBooking = getRandomInt(1, 4);
          
          // Random booking date
          const latestValidTime = new Date(startTime.getTime() - (rules.latestBookingTime + 1) * 3600000);
          const earliestTime = addDays(startTime, -15);
          let bookingDate = earliestTime;
          if (latestValidTime > earliestTime) {
             const timeSpan = latestValidTime.getTime() - earliestTime.getTime();
             bookingDate = new Date(earliestTime.getTime() + Math.random() * timeSpan);
          }
          if (bookingDate > now) bookingDate = now;

          // Lưu Booking trước (Bắt buộc để lấy ID)
          const booking = await bookingRepo.save({
            bookingCode: `BK${Date.now().toString().slice(-6)}${getRandomInt(10,99)}`,
            totalPrice: 0, 
            status: (Math.random() > 0.95) ? 'cancelled' : 'confirmed', 
            bookingDate: bookingDate, user: bookingUser
          });

          let bookingTotal = 0;

          for (let t = 0; t < ticketsInThisBooking; t++) {
            if (seatsSoldSoFar >= seatsToSell) break;
            
            let isBiz = false;
            if (plane.businessSeats > bizSold) isBiz = Math.random() > 0.9;
            if (plane.economySeats <= ecoSold && plane.businessSeats > bizSold) isBiz = true;
            
            const selectedClass = isBiz ? bizClass : ecoClass;
            const finalPrice = Math.floor(flight.price * selectedClass.priceRatio);
            
            // 👉 THAY VÌ LƯU LUÔN, TA PUSH VÀO MẢNG BATCH
            ticketsBatch.push({
              ticketId: `TK${booking.id}${t}${getRandomInt(100,999)}`, // Thêm random để tránh trùng ID vé
              seat: `${getRandomInt(1, 30)}${getRandomItem(['A','B','C','D'])}`,
              seatClass: selectedClass.name,
              price: finalPrice,
              passengerName: (t === 0) ? bookingUser.name : generateName(),
              flight: flight, 
              booking: booking
            });

            bookingTotal += finalPrice;
            seatsSoldSoFar++;
            if (isBiz) bizSold++; else ecoSold++;
          }
          // Cập nhật giá booking
          booking.totalPrice = bookingTotal;
          await bookingRepo.save(booking);
        }

        // 👉 LƯU TOÀN BỘ VÉ CỦA CHUYẾN BAY NÀY TRONG 1 LỆNH (Giảm 99% request)
        if (ticketsBatch.length > 0) {
           // Chia nhỏ batch nếu quá lớn (mỗi lần 100 vé) để Neon không báo lỗi
           const chunkSize = 50; 
           for (let k = 0; k < ticketsBatch.length; k += chunkSize) {
              const chunk = ticketsBatch.slice(k, k + chunkSize);
              await ticketRepo.save(chunk);
           }
        }

        // Cập nhật thông tin chuyến bay
        flight.availableSeats = Math.floor(flight.totalSeats - seatsSoldSoFar);
        await flightRepo.save(flight);

        await flightDetailRepo.update(
          { flight: { id: flight.id }, ticketClass: { id: bizClass.id } }, 
          { soldSeats: bizSold }
        );
        await flightDetailRepo.update(
          { flight: { id: flight.id }, ticketClass: { id: ecoClass.id } }, 
          { soldSeats: ecoSold }
        );
      }
    }

    console.log('✅✅✅ XONG! Full 11 Bảng Tiếng Việt - Đã tối ưu tốc độ.');
  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

bootstrap();