import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { LoggingController } from './logging/logging.controller';
import { LoggingService } from './logging/logging.service';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from './logging/logging.module';
import { KafkaModule } from './kafka/kafka.module';
import { MytopicConsumer } from './kafka/mytopic.consumer';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    LoggingModule,
    AuthModule,
    KafkaModule,
  ],
  controllers: [LoggingController, AppController],
  providers: [LoggingService, MytopicConsumer, AppService],
})
export class AppModule {}
