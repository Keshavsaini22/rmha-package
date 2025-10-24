import { Injectable } from '@nestjs/common';
import { IOutboxRepository } from '../interfaces/outbox-repository.interface';
import { ProducerService } from '../producer/producer.service';

@Injectable()
export class OutboxMessageRelay {
  constructor(
    private readonly outboxRepository: IOutboxRepository,
    private readonly producerService: ProducerService,
  ) {}

  async dispatchMessages(limit: number) {
    try {
      const messages = await this.outboxRepository.getUnsentMessages(limit);

      if (!messages || messages.length === 0) {
        console.log('INFO: No messages pending to dispatch.');
        return;
      }

      console.log(`INFO: Found ${messages.length} pending messages to dispatch`);

      // Publish messages to RabbitMQ
      await this.producerService.publishMessages(messages);

      // Mark messages as sent AFTER successful publishing
      for (const message of messages) {
        try {
          console.log(`💾 Marking message ${message.message_id} as SENT...`);
          await this.outboxRepository.save(message);
          console.log(`✅ Message ${message.message_id} marked as SENT`);
        } catch (error) {
          console.error(
            `❌ Error marking message ${message.message_id} as sent:`,
            error.message,
          );
        }
      }

      console.log(`INFO: Published and marked ${messages.length} messages as sent`);
    } catch (error) {
      console.error('❌ Error dispatching messages:', error);
      throw error;
    }
  }
}
