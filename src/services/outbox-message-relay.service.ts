import { Inject, Injectable } from '@nestjs/common';
import { IOutboxRepository } from '../interfaces/outbox-repository.interface';
import { ProducerService } from '../producer/producer.service';

@Injectable()
export class OutboxMessageRelay {
  constructor(
    private readonly producerService: ProducerService,
    @Inject('OUTBOX_REPOSITORY')
    private readonly outboxMessageRepository: IOutboxRepository,) { }

  async dispatchMessages(limit: number) {
    try {
      const messages =
        await this.outboxMessageRepository.getUnsentMessages(limit);
      if (!messages.length) {
        console.log('INFO: No messages pending to dispatch.');
        return;
      }

      await this.producerService.publishMessages(messages);
      console.log(`INFO: Published ${messages.length} messages.`);
    } catch (error) {
      console.log('Error in publishing messages ', error);
    }
  }
}
