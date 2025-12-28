import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Fix schema cho bảng VE trong trường hợp DB đã được tạo từ version cũ
 * (thiếu một vài cột như CCCD / SoDienThoai / Email...).
 *
 * Mục tiêu: backend chạy được ngay mà không bắt bạn phải tự ALTER TABLE.
 */
@Injectable()
export class TicketsSchemaService implements OnModuleInit {
  private readonly logger = new Logger(TicketsSchemaService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Các cột UI đang cần cho TicketsTab
      await this.dataSource.query(
        `ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "TenHanhKhach" varchar(255)`
      );
      await this.dataSource.query(
        `ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "CCCD" varchar(20)`
      );
      await this.dataSource.query(
        `ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "SoDienThoai" varchar(20)`
      );
      await this.dataSource.query(
        `ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "Email" varchar(255)`
      );
      await this.dataSource.query(
        `ALTER TABLE IF EXISTS "VE" ADD COLUMN IF NOT EXISTS "MaPhieuDat" varchar(50)`
      );
    } catch (e: any) {
      // Không crash app: nếu DB không cho ALTER (managed DB / quyền hạn),
      // thì log để bạn biết và xử lý thủ công.
      this.logger.warn(
        `Không thể tự động đồng bộ cột cho bảng VE. Nếu bạn đang dùng DB cũ, hãy tự ALTER TABLE. Lý do: ${e?.message ?? e}`
      );
    }
  }
}
