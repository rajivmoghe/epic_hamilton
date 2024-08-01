import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { AuthModule } from 'src/auth/auth.module';
import { KafkaModule } from '../kafka/kafka.module';
import { ProducerService } from '../kafka/kafka.producer.service';

@Module({
  imports: [ConfigModule, AuthModule, KafkaModule],
  providers: [LoggingService, ProducerService],
  controllers: [LoggingController],
})
export class LoggingModule {}
