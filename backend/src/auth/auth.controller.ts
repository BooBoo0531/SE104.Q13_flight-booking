import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string },
  ) {
    return this.authService.resetPassword(token, body.password);
  }

  @Post('reset-admin-password')
  async resetAdminPassword() {
    return this.authService.resetAdminPassword();
  }
}
