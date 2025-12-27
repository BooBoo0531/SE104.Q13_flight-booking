import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity'; // Import Setting
import { CreateFlightDto } from './dto/create-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,

    // 👇 Inject Setting Repo để đọc bảng tham số
    @InjectRepository(Setting)
    private settingRepo: Repository<Setting>,
  ) {}

  // --- 1. TẠO CHUYẾN BAY (FULL LOGIC) ---
  async create(dto: CreateFlightDto) {
    // 👇 Ép kiểu sang 'any' để tránh lỗi TypeScript nếu file DTO của bạn chưa cập nhật kịp
    const input = dto as any; 

    // A. Lấy quy định từ Database (ID = 1)
    const settings = await this.settingRepo.findOne({ where: { id: 1 } });
    
    // Nếu chưa seed bảng Setting thì dùng giá trị mặc định (30 phút)
    const minFlightTime = settings ? settings.minFlightTime : 30;

    // B. Tính toán thời gian bay
    // Input từ Frontend thường là string ISO, cần chuyển sang Date
    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);

    // Kiểm tra logic thời gian: Ngày về phải sau ngày đi
    if (endTime.getTime() <= startTime.getTime()) {
      throw new BadRequestException('Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!');
    }

    // Tính thời lượng (phút) = (Hiệu số milisecond) / 60000
    const duration = (endTime.getTime() - startTime.getTime()) / 60000;

    // C. KIỂM TRA RÀNG BUỘC (QUY ĐỊNH)
    if (duration < minFlightTime) {
      throw new BadRequestException(
        `Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu phải là ${minFlightTime} phút.`
      );
    }

    // D. Chuẩn bị dữ liệu để lưu vào Database
    // ⚠️ QUAN TRỌNG: TypeORM cần object { id: ... } cho các quan hệ, nhưng FE gửi lên chỉ là số ID
    const newFlight = this.flightRepo.create({
      ...input, // Copy các trường cơ bản (flightCode, price...)
      
      duration: duration, 
      availableSeats: input.totalSeats, // Mặc định ghế trống = tổng ghế
      
      // 👇 MAP ID SANG RELATION OBJECT
      plane: input.planeId ? { id: input.planeId } : undefined,
      fromAirport: input.fromAirportId ? { id: input.fromAirportId } : undefined,
      toAirport: input.toAirportId ? { id: input.toAirportId } : undefined,
    });

    return await this.flightRepo.save(newFlight);
  }

  // --- 2. LẤY DANH SÁCH (KÈM QUAN HỆ) ---
  async findAll() {
    return await this.flightRepo.find({
      // 👇 Quan trọng: Lấy kèm thông tin để Frontend hiển thị tên Sân bay/Máy bay thay vì số ID
      relations: ['plane', 'fromAirport', 'toAirport'], 
      order: {
        startTime: 'ASC', // Sắp xếp ngày gần nhất lên đầu
      },
    });
  }

  // --- 3. LẤY CHI TIẾT 1 CHUYẾN ---
  async findOne(id: number) {
    return await this.flightRepo.findOne({
      where: { id },
      relations: ['plane', 'fromAirport', 'toAirport', 'tickets'],
    });
  }

  // --- 4. CẬP NHẬT CHUYẾN BAY ---
  async update(id: number, dto: CreateFlightDto) {
    const input = dto as any;
    
    // Lấy chuyến bay hiện tại
    const flight = await this.flightRepo.findOne({ where: { id } });
    if (!flight) {
      throw new BadRequestException('Không tìm thấy chuyến bay');
    }

    // Kiểm tra quy định nếu có thay đổi thời gian
    if (input.startTime && input.endTime) {
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);
      
      if (endTime.getTime() <= startTime.getTime()) {
        throw new BadRequestException('Thời gian hạ cánh phải sau thời gian cất cánh!');
      }

      const duration = (endTime.getTime() - startTime.getTime()) / 60000;
      const settings = await this.settingRepo.findOne({ where: { id: 1 } });
      const minFlightTime = settings ? settings.minFlightTime : 30;

      if (duration < minFlightTime) {
        throw new BadRequestException(
          `Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu: ${minFlightTime} phút.`
        );
      }

      input.duration = duration;
    }

    // Tính số vé đã đặt (totalSeats cũ - availableSeats cũ)
    const ticketsSold = flight.totalSeats - flight.availableSeats;
    
    // Update các trường
    Object.assign(flight, {
      ...input,
      plane: input.planeId ? { id: input.planeId } : flight.plane,
      fromAirport: input.fromAirportId ? { id: input.fromAirportId } : flight.fromAirport,
      toAirport: input.toAirportId ? { id: input.toAirportId } : flight.toAirport,
    });
    
    // Nếu thay đổi totalSeats (thường do đổi máy bay), cập nhật lại availableSeats
    if (input.totalSeats !== undefined) {
      flight.availableSeats = input.totalSeats - ticketsSold;
    }

    return await this.flightRepo.save(flight);
  }

  // --- 5. XÓA CHUYẾN BAY ---
  async remove(id: number) {
    const flight = await this.flightRepo.findOne({ 
      where: { id },
      relations: ['tickets']
    });

    if (!flight) {
      throw new BadRequestException('Không tìm thấy chuyến bay');
    }

    // Kiểm tra xem đã có vé được đặt chưa
    if (flight.tickets && flight.tickets.length > 0) {
      throw new BadRequestException('Không thể xóa chuyến bay đã có vé được đặt');
    }

    await this.flightRepo.remove(flight);
    return { message: 'Xóa chuyến bay thành công' };
  }
}