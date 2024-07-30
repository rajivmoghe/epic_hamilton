import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.configService.get<boolean>('secureLog')) {
      const request = context.switchToHttp().getRequest();
      const apiKey = request.headers['x-api-key'];
      const apiSecret = request.headers['x-api-secret'];

      if (!apiKey || !apiSecret) {
        throw new UnauthorizedException();
      }
      if (!this.authService.validateApiSecret(apiKey, apiSecret)) {
        throw new UnauthorizedException();
      }
      return true;
    }
    return true;
  }
}
