import { Injectable } from '@nestjs/common';
import { RabbitmqConnectionService } from './rabbitmq-connection.service';
import { ConfigType } from '../interfaces/rabbitmq.interface';

@Injectable()
export class RabbitmqConfigurerService {
  private connection: RabbitmqConnectionService;
  private config: ConfigType;

  constructor(private rabbitmqConnectionService: RabbitmqConnectionService) {
    this.connection = this.rabbitmqConnectionService;
    this.config = this.connection.getConnectionConfiguration();
  }

  async configure() {
    await this.connection.exchange(this.config.fanoutExchange, 'fanout');
    await this.connection.exchange(this.config.directExchange, 'direct');

    await this.connection.queue(
      this.config.fanoutExchange,
      this.config.primaryQueue,
      { durable: true },
      '',
    );
    await this.connection.queue(
      this.config.directExchange,
      this.config.retryQueue,
      {
        durable: true,
        deadLetterExchange: this.config.fanoutExchange,
        messageTtl: this.config.retryQueueMessageTtl,
      },
      this.config.retryBindingKey,
    );
  }
}
