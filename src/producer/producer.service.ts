import { Inject, Injectable } from '@nestjs/common';
import { OutboxMessage } from '../entities';
import { ConfigType, IOutboxRepository, RabbitMQPublishMessage } from '../interfaces';
import { RabbitmqConfigurerService, RabbitmqConnectionService } from '../services';


@Injectable()
export class ProducerService {
  private connection: RabbitmqConnectionService;
  private config: ConfigType;

  constructor(
    private readonly rabbitmqConfigurerService: RabbitmqConfigurerService,
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
    @Inject('OUTBOX_REPOSITORY') 
    private readonly outboxMessageRepository: IOutboxRepository,
  ) {
    this.connection = this.rabbitmqConnectionService;
    this.config = this.connection.getConnectionConfiguration();
  }

  async publishMessages(messages: OutboxMessage[]) {
    await this.connect();

    for (const message of messages) {
      await this.publisher(message);
    }

    await this.close();
  }

  private async connect() {
    await this.connection.connect();
    await this.rabbitmqConfigurerService.configure();
  }

  private async close() {
    await this.connection.closeChannel();
  }

  private async publisher(outboxMessage: OutboxMessage) {
    try {
      const message = outboxMessage.getBody();
      const properties = outboxMessage.getProperties();
      const messageToPublish: RabbitMQPublishMessage = {
        exchange: this.config.fanoutExchange,
        bindingKey: '',
        content: JSON.stringify(message),
        properties: { ...properties, persistent: true },
      };

      const isPublished = await this.connection.publish(messageToPublish);
      if (!isPublished) throw new Error('Message could not be published.');

      outboxMessage.markAsSent();

      await this.outboxMessageRepository.save(outboxMessage);
    } catch (error) {
      console.log(
        `Error while publishing message ${outboxMessage.type} with id ${outboxMessage.message_id}`,
        error,
      );
    }
  }
}
