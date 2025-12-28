import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Setting } from '../settings/entities/setting.entity';
import { IntermediateAirport } from '../intermediate-airports/entities/intermediate-airport.entity';
import { CreateFlightDto } from './dto/create-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,

    @InjectRepository(Setting)
    private settingRepo: Repository<Setting>,

    @InjectRepository(IntermediateAirport)
    private intermediateRepo: Repository<IntermediateAirport>,
  ) {}

  // --- 1. TẠO CHUYẾN BAY ---
  async create(dto: CreateFlightDto) {
    const input = dto as any; 

    const settings = await this.settingRepo.findOne({ where: { id: 1 } });
    
    const minFlightTime = settings ? settings.minFlightTime : 30;
    const maxIntermediateAirports = settings ? settings.maxIntermediateAirports : 2;
    const minStopoverTime = settings ? settings.minStopoverTime : 10;
    const maxStopoverTime = settings ? settings.maxStopoverTime : 20;

    // Tính toán thời gian bay
    const startTime = new Date(input.startTime);
    const endTime = new Date(input.endTime);
    const now = new Date();

    // Kiểm tra quy định: Tạo chuyến bay phải trước 72 giờ
    const hoursUntilFlight = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilFlight < 0) {
      throw new BadRequestException(
        'Không thể tạo chuyến bay với thời gian đã qua. Vui lòng chọn thời gian trong tương lai.'
      );
    }
    if (hoursUntilFlight < 72) {
      throw new BadRequestException(
        `Vi phạm quy định: Chỉ được tạo chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`
      );
    }

    if (endTime.getTime() <= startTime.getTime()) {
      throw new BadRequestException('Lỗi: Thời gian hạ cánh phải sau thời gian cất cánh!');
    }

    const duration = (endTime.getTime() - startTime.getTime()) / 60000;

    if (duration < minFlightTime) {
      throw new BadRequestException(
        `Vi phạm quy định: Thời gian bay quá ngắn (${Math.floor(duration)} phút). Tối thiểu phải là ${minFlightTime} phút.`
      );
    }

    if (input.intermediateAirports && input.intermediateAirports.length > 0) {
      if (input.intermediateAirports.length > maxIntermediateAirports) {
        throw new BadRequestException(
          `Vi phạm quy định: Số sân bay trung gian tối đa là ${maxIntermediateAirports}`
        );
      }

      for (const inter of input.intermediateAirports) {
        if (inter.duration < minStopoverTime || inter.duration > maxStopoverTime) {
          throw new BadRequestException(
            `Vi phạm quy định: Thời gian dừng tại sân bay trung gian phải từ ${minStopoverTime} đến ${maxStopoverTime} phút`
          );
        }
      }
    }

    const newFlight = this.flightRepo.create({
      ...input,
      duration: duration, 
      availableSeats: input.totalSeats,
      plane: input.planeId ? { id: input.planeId } as any : undefined,
      fromAirport: input.fromAirportId ? { id: input.fromAirportId } as any : undefined,
      toAirport: input.toAirportId ? { id: input.toAirportId } as any : undefined,
    });

    const savedFlight = await this.flightRepo.save(newFlight);

    if (input.intermediateAirports && input.intermediateAirports.length > 0) {
      for (const inter of input.intermediateAirports) {
        await this.intermediateRepo.save({
          flight: savedFlight as any,
          airport: { id: inter.airportId } as any,
          duration: inter.duration,
          note: inter.note || '',
        });
      }
    }

    return savedFlight;
  }

  async findAll() {
    return await this.flightRepo.find({
      relations: ['plane', 'fromAirport', 'toAirport', 'intermediates', 'intermediates.airport'], 
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.flightRepo.findOne({
      where: { id },
      relations: ['plane', 'fromAirport', 'toAirport', 'tickets', 'intermediates', 'intermediates.airport'],
    });
  }

  async update(id: number, dto: CreateFlightDto) {
    const input = dto as any;
  
    const flight = await this.flightRepo.findOne({ where: { id } });
    if (!flight) {
      throw new BadRequestException('Không tìm thấy chuyến bay');
    }

    // Kiểm tra quy định: Cập nhật phải trước 72 giờ
    const now = new Date();
    const startTime = input.startTime ? new Date(input.startTime) : flight.startTime;
    const hoursUntilFlight = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilFlight < 0) {
      throw new BadRequestException(
        'Không thể cập nhật chuyến bay đã cất cánh hoặc đã hoàn thành.'
      );
    }
    if (hoursUntilFlight < 72) {
      throw new BadRequestException(
        `Vi phạm quy định: Chỉ được cập nhật chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`
      );
    }

    if (input.startTime && input.endTime) {
      const newStartTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);
      
      if (endTime.getTime() <= newStartTime.getTime()) {
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

    const ticketsSold = flight.totalSeats - flight.availableSeats;

    Object.assign(flight, {
      ...input,
      plane: input.planeId ? { id: input.planeId } : flight.plane,
      fromAirport: input.fromAirportId ? { id: input.fromAirportId } : flight.fromAirport,
      toAirport: input.toAirportId ? { id: input.toAirportId } : flight.toAirport,
    });

    if (input.totalSeats !== undefined) {
      flight.availableSeats = input.totalSeats - ticketsSold;
    }

    const savedFlight = await this.flightRepo.save(flight);

    // Cập nhật sân bay trung gian
    if (input.intermediateAirports !== undefined) {
      // Xóa các sân bay trung gian cũ
      await this.intermediateRepo.delete({ flight: { id: savedFlight.id } });

      // Thêm sân bay trung gian mới
      if (input.intermediateAirports.length > 0) {
        const settings = await this.settingRepo.findOne({ where: { id: 1 } });
        const maxIntermediateAirports = settings ? settings.maxIntermediateAirports : 2;
        const minStopoverTime = settings ? settings.minStopoverTime : 10;
        const maxStopoverTime = settings ? settings.maxStopoverTime : 20;

        if (input.intermediateAirports.length > maxIntermediateAirports) {
          throw new BadRequestException(
            `Vi phạm quy định: Số sân bay trung gian tối đa là ${maxIntermediateAirports}`
          );
        }

        for (const inter of input.intermediateAirports) {
          if (inter.duration < minStopoverTime || inter.duration > maxStopoverTime) {
            throw new BadRequestException(
              `Vi phạm quy định: Thời gian dừng tại sân bay trung gian phải từ ${minStopoverTime} đến ${maxStopoverTime} phút`
            );
          }

          await this.intermediateRepo.save({
            flight: savedFlight as any,
            airport: { id: inter.airportId } as any,
            duration: inter.duration,
            note: inter.note || '',
          });
        }
      }
    }

    return savedFlight;
  }

  // ---  XÓA CHUYẾN BAY ---
  async remove(id: number) {
    const flight = await this.flightRepo.findOne({ 
      where: { id },
      relations: ['tickets']
    });

    if (!flight) {
      throw new BadRequestException('Không tìm thấy chuyến bay');
    }

    // Kiểm tra quy định: Xóa phải trước 72 giờ
    const now = new Date();
    const hoursUntilFlight = (flight.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilFlight < 0) {
      throw new BadRequestException(
        'Không thể hủy chuyến bay đã cất cánh hoặc đã hoàn thành.'
      );
    }
    if (hoursUntilFlight < 72) {
      throw new BadRequestException(
        `Vi phạm quy định: Chỉ được hủy chuyến bay trước ít nhất 72 giờ. Hiện tại chỉ còn ${Math.floor(hoursUntilFlight)} giờ.`
      );
    }

    // Kiểm tra xem đã có vé được đặt chưa
    if (flight.tickets && flight.tickets.length > 0) {
      throw new BadRequestException('Không thể xóa chuyến bay đã có vé được đặt');
    }

    await this.flightRepo.remove(flight);
    return { message: 'Xóa chuyến bay thành công' };
  }
}