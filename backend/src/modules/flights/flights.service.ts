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
}