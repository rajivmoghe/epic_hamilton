import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/kafka.producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async getHello() {
    const value = { value0: 'string 0', value1: 'string 1' };
    await this.producerService.produce({
      topic: 'mytopic',
      messages: [
        {
          value: Buffer.from(JSON.stringify(value)),
        },
      ],
    });

    return 'The Server is Running...';
  }
}
