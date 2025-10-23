import { Inject, Injectable } from '@nestjs/common';
import * as RabbitMQ from 'amqplib';
import { RabbitmqConnectionService } from './rabbitmq-connection.service';
import { IInboxRepository } from '../interfaces/inbox-repository.interface';
import { IMessageHandlerRegistry } from '../interfaces/message-handler-registry.interface';

@Injectable()
export class InboxMessageHandler {
  constructor(
    private readonly rabbitmqConnectionService: RabbitmqConnectionService,
@Inject('MESSAGE_HANDLER_REGISTRY')
    private readonly signatureTypes: IMessageHandlerRegistry,
    @Inject('INBOX_REPOSITORY')
    private readonly inboxMessageRepository: IInboxRepository,
  ) { }

  getSignatureType() {
    return Object.keys(this.signatureTypes.getSignatureTypes());
  }

  async handleMessage(message: RabbitMQ.Message, max_retry_counts: number) {
    const messageId = message.properties.messageId;
    const message_type =
      message.properties.type || message.properties.headers.type;
    const signatureTypes = this.signatureTypes.getSignatureTypes();
    const handlers = signatureTypes[message_type];

    const handlerPromises = handlers.map(async (lazyHandler) => {
      const handler = await lazyHandler;
      let retryCount = max_retry_counts;
      const duplicateMessage =
        await this.inboxMessageRepository.getInboxMessageById(
          messageId,
          handler.getHandlerName(),
        );
      if (duplicateMessage) {
        console.log(
          `INFO Message with id ${messageId} already handled with ${handler.getHandlerName()}. Duplicate message ignored.`,
        );
        return;
      }
      const parsedMessage =
        this.rabbitmqConnectionService.robustParseMessageContent(message);

      console.log(
        'INFO Handling message with the following parsed content:',
        parsedMessage,
      );

      const messageObj = {
        messageId: messageId,
        body: parsedMessage,
      };

      let err: Error;

      while (retryCount >= 0) {
        try {
          console.log(
            `INFO Handling message with messageId: ${messageId} and handler ${handler.getHandlerName()}`,
          );
          await handler.handleEvent(messageObj);
          console.log(`INFO Message ${messageId} handled successfully.`);
          return;
        } catch (error) {
          retryCount--;
          err = error;
        }
      }

      if (retryCount < 0) throw err;
    });

    const results = await Promise.allSettled(handlerPromises);
    const rejectedPromises = results.filter(
      (result) => result.status === 'rejected',
    );
    if (rejectedPromises.length) {
      throw rejectedPromises.map((result) => result.reason);
    }
  }
}
