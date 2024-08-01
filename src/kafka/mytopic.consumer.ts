import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class MytopicConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly loggingService: LoggingService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topic: 'mytopic' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            mesage: 'Value from the Broker',
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
          this.loggingService.log(JSON.parse(message.value.toString()));
        },
      },
    );
  }
}
