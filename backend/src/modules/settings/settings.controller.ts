import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Get()
  getRules() {
    return this.svc.getRulesForUI();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị', 'Ban giám đốc')
  @Patch()
  updateRules(@Body() dto: UpdateSettingsDto) {
    return this.svc.updateRulesFromUI(dto);
  }

  // FE hiện đang gọi PUT /settings -> hỗ trợ luôn để khỏi lỗi 404
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Quản trị', 'Ban giám đốc')
  @Put()
  replaceRules(@Body() dto: UpdateSettingsDto) {
    return this.svc.updateRulesFromUI(dto);
  }
}
