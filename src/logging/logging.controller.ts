import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('log')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async log(@Body() data: any): Promise<void> {
    await this.loggingService.log(data);
  }
}
