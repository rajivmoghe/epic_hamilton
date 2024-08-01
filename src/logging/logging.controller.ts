import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProducerRecord } from 'kafkajs';

@Controller('log')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Post('/file')
  @UseGuards(JwtAuthGuard)
  async log(@Body() data: any): Promise<void> {
    console.log(`... ${Math.floor(Date.now() / 1000)}`);
    await this.loggingService.log(data);
  }

  @Post('/kafka')
  @UseGuards(JwtAuthGuard)
  async logToKafka(@Body() data: any): Promise<void> {
    const { topic, messages } = data;
    const newmessages = [];
    for (const amessage of messages) {
      const _fixedmsg = {};
      if (amessage['key']) {
        _fixedmsg['key'] = Buffer.from(JSON.stringify(amessage['key']));
      }
      _fixedmsg['value'] = Buffer.from(JSON.stringify(amessage['value']));
      newmessages.push(_fixedmsg);
    }
    const record: ProducerRecord = { topic, messages: newmessages };

    await this.loggingService.logToKafka(record);
  }
}
