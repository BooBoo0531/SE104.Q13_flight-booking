"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./config/data-source");
const flight_entity_1 = require("./modules/flights/entities/flight.entity");
const user_entity_1 = require("./modules/users/entities/user.entity");
const airport_entity_1 = require("./modules/airports/entities/airport.entity");
const airplane_entity_1 = require("./modules/airplanes/entities/airplane.entity");
const ticket_entity_1 = require("./modules/tickets/entities/ticket.entity");
const ticket_class_entity_1 = require("./modules/ticket-classes/entities/ticket-class.entity");
const booking_entity_1 = require("./modules/bookings/entities/booking.entity");
const setting_entity_1 = require("./modules/settings/entities/setting.entity");
const seat_entity_1 = require("./modules/seats/entities/seat.entity");
const intermediate_airport_entity_1 = require("./modules/intermediate-airports/entities/intermediate-airport.entity");
const flight_ticket_class_entity_1 = require("./modules/flight-ticket-classes/entities/flight-ticket-class.entity");
const hoVN = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Huỳnh', 'Hoàng', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const demVN = ['Văn', 'Thị', 'Minh', 'Thanh', 'Ngọc', 'Quốc', 'Tuấn', 'Hải', 'Đức', 'Xuân', 'Thu', 'Phương', 'Hữu', 'Gia', 'Khánh'];
const tenVN = ['Anh', 'Bình', 'Châu', 'Dương', 'Em', 'Hùng', 'Huy', 'Khánh', 'Lan', 'Long', 'Mai', 'Nam', 'Nhi', 'Phúc', 'Quân', 'Sơn', 'Thảo', 'Trang', 'Tú', 'Uyên', 'Việt', 'Yến', 'Tâm', 'Thắng', 'Tài'];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
};
const generateName = () => `${getRandomItem(hoVN)} ${getRandomItem(demVN)} ${getRandomItem(tenVN)}`;
const generateEmail = (name, domain) => {
    const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/ /g, "");
    return `${cleanName}${getRandomInt(100, 9999)}@${domain}`;
};
async function bootstrap() {
    try {
        console.log('🌱 Đang kết nối Database...');
        if (!data_source_1.AppDataSource.isInitialized)
            await data_source_1.AppDataSource.initialize();
        console.log('🧹 Đang dọn dẹp dữ liệu cũ (Full 11 bảng)...');
        const queryRunner = data_source_1.AppDataSource.createQueryRunner();
        const tables = [
            'ticket', 'booking',
            'CT_HANGVE', 'TRUNGGIAN',
            'flight',
            'GHE', 'airplane',
            'airport', 'ticket_class',
            'user', 'setting'
        ];
        for (const table of tables) {
            await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE`);
        }
        const flightRepo = data_source_1.AppDataSource.getRepository(flight_entity_1.Flight);
        const userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const airportRepo = data_source_1.AppDataSource.getRepository(airport_entity_1.Airport);
        const airplaneRepo = data_source_1.AppDataSource.getRepository(airplane_entity_1.Airplane);
        const ticketRepo = data_source_1.AppDataSource.getRepository(ticket_entity_1.Ticket);
        const classRepo = data_source_1.AppDataSource.getRepository(ticket_class_entity_1.TicketClass);
        const bookingRepo = data_source_1.AppDataSource.getRepository(booking_entity_1.Booking);
        const settingRepo = data_source_1.AppDataSource.getRepository(setting_entity_1.Setting);
        const seatRepo = data_source_1.AppDataSource.getRepository(seat_entity_1.Seat);
        const interRepo = data_source_1.AppDataSource.getRepository(intermediate_airport_entity_1.IntermediateAirport);
        const flightDetailRepo = data_source_1.AppDataSource.getRepository(flight_ticket_class_entity_1.FlightTicketClass);
        console.log('⚙️ Thiết lập Quy định...');
        const rules = await settingRepo.save({
            minFlightTime: 30, maxIntermediateAirports: 2, minStopoverTime: 10, maxStopoverTime: 20, latestBookingTime: 12, latestCancellationTime: 24
        });
        console.log('🎫 Tạo Hạng vé...');
        const ecoClass = await classRepo.save({ name: 'Phổ thông', priceRatio: 1.0 });
        const bizClass = await classRepo.save({ name: 'Thương gia', priceRatio: 1.5 });
        console.log('👥 Tạo User...');
        await userRepo.save({ name: 'Super Admin', email: 'admin@flight.com', password: '123', role: 'admin' });
        for (let i = 0; i < 10; i++) {
            const name = generateName();
            await userRepo.save({ name: name, email: generateEmail(name, 'flightadmin.com'), password: '123', role: Math.random() > 0.7 ? 'manager' : 'staff', phone: `09${getRandomInt(10000000, 99999999)}` });
        }
        const customers = [];
        for (let i = 0; i < 50; i++) {
            const name = generateName();
            const user = await userRepo.save({ name: name, email: generateEmail(name, getRandomItem(['gmail.com', 'yahoo.com'])), password: '123', role: 'user', phone: `03${getRandomInt(10000000, 99999999)}` });
            customers.push(user);
        }
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
        console.log('✈️ Tạo Đội bay & Ghế vật lý...');
        const planesData = [
            { name: 'Boeing 787-9', seats: 200, bizRows: 4, seatsPerRow: 6 },
            { name: 'Airbus A321neo', seats: 150, bizRows: 2, seatsPerRow: 6 },
            { name: 'Airbus A350', seats: 250, bizRows: 5, seatsPerRow: 9 },
        ];
        const planes = [];
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
            const seatsToSave = [];
            const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K'];
            for (let r = 1; r <= totalRows; r++) {
                for (let c = 0; c < type.seatsPerRow; c++) {
                    if (seatsToSave.length >= type.seats)
                        break;
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
        console.log('🚀 Đang tạo 80 Chuyến bay (Kèm Trung gian & Chi tiết vé)...');
        for (let i = 1; i <= 80; i++) {
            let from = getRandomItem(airports);
            let to = getRandomItem(airports);
            while (from.code === to.code)
                to = getRandomItem(airports);
            const plane = getRandomItem(planes);
            let startTime;
            const randTimeStrategy = Math.random();
            if (randTimeStrategy > 0.7) {
                startTime = addMinutes(new Date(), getRandomInt(-180, 180));
            }
            else {
                const daysFromNow = getRandomInt(-60, 30);
                startTime = addDays(new Date(), daysFromNow);
                startTime.setHours(getRandomInt(6, 23), getRandomItem([0, 15, 30, 45]), 0);
            }
            const duration = getRandomInt(rules.minFlightTime, 180);
            const endTime = new Date(startTime.getTime() + duration * 60000);
            const now = new Date();
            let flightStatus = 'scheduled';
            if (endTime < now)
                flightStatus = 'completed';
            else if (startTime <= now && now <= endTime)
                flightStatus = 'flying';
            else {
                const rand = Math.random();
                if (rand > 0.95)
                    flightStatus = 'cancelled';
                else if (rand > 0.9)
                    flightStatus = 'delayed';
                else {
                    const boardingTime = new Date(startTime.getTime() - 45 * 60000);
                    if (now >= boardingTime)
                        flightStatus = 'boarding';
                    else
                        flightStatus = 'scheduled';
                }
            }
            const flight = await flightRepo.save({
                flightCode: `VN${getRandomInt(1000, 9999)}`,
                fromAirport: from, toAirport: to, startTime, endTime, duration,
                price: getRandomInt(6, 30) * 100000,
                totalSeats: plane.totalSeats, availableSeats: plane.totalSeats,
                status: flightStatus, plane: plane,
            });
            if (Math.random() > 0.7) {
                let interAirport = getRandomItem(airports);
                while (interAirport.code === from.code || interAirport.code === to.code)
                    interAirport = getRandomItem(airports);
                await interRepo.save({
                    flight: flight,
                    airport: interAirport,
                    duration: getRandomInt(20, 45),
                    note: 'Dừng nạp nhiên liệu & đón khách'
                });
            }
            await flightDetailRepo.save({
                flight: flight,
                ticketClass: bizClass,
                totalSeats: plane.businessSeats,
                soldSeats: 0,
                price: Math.floor(flight.price * bizClass.priceRatio)
            });
            await flightDetailRepo.save({
                flight: flight,
                ticketClass: ecoClass,
                totalSeats: plane.economySeats,
                soldSeats: 0,
                price: Math.floor(flight.price * ecoClass.priceRatio)
            });
            if (flightStatus !== 'cancelled') {
                const fillRate = getRandomInt(30, 95) / 100;
                const seatsToSell = Math.floor(plane.totalSeats * fillRate);
                let seatsSoldSoFar = 0;
                let bizSold = 0;
                let ecoSold = 0;
                while (seatsSoldSoFar < seatsToSell) {
                    const bookingUser = getRandomItem(customers);
                    const ticketsInThisBooking = getRandomInt(1, 4);
                    const latestValidTime = new Date(startTime.getTime() - (rules.latestBookingTime + 1) * 3600000);
                    const earliestTime = addDays(startTime, -15);
                    let bookingDate = earliestTime;
                    if (latestValidTime > earliestTime) {
                        const timeSpan = latestValidTime.getTime() - earliestTime.getTime();
                        bookingDate = new Date(earliestTime.getTime() + Math.random() * timeSpan);
                    }
                    if (bookingDate > now)
                        bookingDate = now;
                    let bookingStatus = 'confirmed';
                    if (Math.random() > 0.95)
                        bookingStatus = 'cancelled';
                    let bookingTotal = 0;
                    const booking = await bookingRepo.save({
                        bookingCode: `BK${Date.now().toString().slice(-6)}${getRandomInt(10, 99)}`,
                        totalPrice: 0, status: bookingStatus, bookingDate: bookingDate, user: bookingUser
                    });
                    for (let t = 0; t < ticketsInThisBooking; t++) {
                        if (seatsSoldSoFar >= seatsToSell)
                            break;
                        let isBiz = false;
                        if (plane.businessSeats > bizSold) {
                            isBiz = Math.random() > 0.9;
                        }
                        if (plane.economySeats <= ecoSold && plane.businessSeats > bizSold)
                            isBiz = true;
                        const selectedClass = isBiz ? bizClass : ecoClass;
                        const finalPrice = Math.floor(flight.price * selectedClass.priceRatio);
                        await ticketRepo.save({
                            ticketId: `TK${booking.id}${t}`,
                            seat: `${getRandomInt(1, 30)}${getRandomItem(['A', 'B', 'C', 'D', 'E'])}`,
                            seatClass: selectedClass.name,
                            price: finalPrice,
                            passengerName: (t === 0) ? bookingUser.name : generateName(),
                            flight: flight, booking: booking
                        });
                        bookingTotal += finalPrice;
                        seatsSoldSoFar++;
                        if (isBiz)
                            bizSold++;
                        else
                            ecoSold++;
                    }
                    booking.totalPrice = bookingTotal;
                    await bookingRepo.save(booking);
                }
                flight.availableSeats = Math.floor(flight.totalSeats - seatsSoldSoFar);
                await flightRepo.save(flight);
                await flightDetailRepo.update({ flight: { id: flight.id }, ticketClass: { id: bizClass.id } }, { soldSeats: bizSold });
                await flightDetailRepo.update({ flight: { id: flight.id }, ticketClass: { id: ecoClass.id } }, { soldSeats: ecoSold });
            }
        }
        console.log('✅✅✅ XONG! Full 11 Bảng - Dữ liệu hoàn hảo.');
    }
    catch (err) {
        console.error('❌ Lỗi:', err);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map