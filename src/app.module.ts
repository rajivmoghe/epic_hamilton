import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { LoggingController } from './logging/logging.controller';
import { LoggingService } from './logging/logging.service';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    LoggingModule,
    AuthModule,
  ],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class AppModule {}
