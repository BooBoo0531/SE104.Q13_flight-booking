import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightDto } from './create-flight.dto';

// PartialType: Tất cả fields từ CreateFlightDto trở thành optional
export class UpdateFlightDto extends PartialType(CreateFlightDto) {}
