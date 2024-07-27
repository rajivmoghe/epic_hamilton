import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request')
  requestCredentials(): { apiKey: string; apiSecret: string } {
    return this.authService.generateCredentials();
  }

  @Post('refresh')
  refreshSecret(@Body('apiKey') apiKey: string): { apiSecret: string } {
    try {
      return this.authService.refreshApiSecret(apiKey);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Get('keys')
  getAllKeys(): { keys: string[] } {
    return { keys: this.authService.getAllKeys() };
  }
}
