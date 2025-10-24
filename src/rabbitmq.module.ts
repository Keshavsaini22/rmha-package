import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RabbitmqConfigService } from './services/rabbitmq-config.service';
import { RabbitmqConnectionService } from './services/rabbitmq-connection.service';
import { RabbitmqConfigurerService } from './services/rabbitmq-configurer.service';
import { InboxMessageHandler } from './services/inbox-message-handler.service';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';

export interface RabbitmqModuleOptions {
  username: string;
  password: string;
  dsn: string;
  appName: string;
  fanoutExchange: string;
  directExchange: string;
  primaryQueue: string;
  retryQueue: string;
  retryBindingKey: string;
  errorBindingKey: string;
  heartbeatInterval: number;
  delayedRetriesNumber: number;
  immediateRetriesNumber: number;
  retryQueueMessageTtl: number;
  consumeMessageLimit: number;
  dispatchMessageLimit: number;

  inboxRepoProvider?: Provider;
  messageHandlerRegistryProvider?: Provider;
}

@Global()
@Module({})
export class RabbitmqModule {
  static forRoot(options: RabbitmqModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: RabbitmqConfigService,
        useFactory: () => {
          const service = new RabbitmqConfigService();
          service.setConfig(options);
          return service;
        },
      },
      RabbitmqConnectionService,
      RabbitmqConfigurerService,
      ProducerService,
    ];

    const exports: any[] = [
      RabbitmqConfigService,
      RabbitmqConnectionService,
      RabbitmqConfigurerService,
      ProducerService,
    ];

    if (options.inboxRepoProvider) {
      providers.push(options.inboxRepoProvider);
      exports.push('INBOX_REPOSITORY');
    }

    if (options.messageHandlerRegistryProvider) {
      providers.push(options.messageHandlerRegistryProvider);
      exports.push('MESSAGE_HANDLER_REGISTRY');
      providers.push(InboxMessageHandler, ConsumerService);
      exports.push(InboxMessageHandler, ConsumerService);
    }

    return {
      module: RabbitmqModule,
      providers,
      exports,
    };
  }
}
