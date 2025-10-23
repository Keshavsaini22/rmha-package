// src/rabbitmq.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RabbitmqConfigService } from './services/rabbitmq-config.service';
import { RabbitmqConnectionService } from './services/rabbitmq-connection.service';
import { RabbitmqConfigurerService } from './services/rabbitmq-configurer.service';
import { InboxMessageHandler } from './services/inbox-message-handler.service';
import { OutboxMessageRelay } from './services/outbox-message-relay.service';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';

export interface RabbitmqModuleOptions {
  // RabbitMQ configuration
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

  // Provider configurations
  inboxRepoProvider: Provider;
  outboxRepoProvider: Provider;
  messageHandlerRegistryProvider: Provider;
}

@Global()
@Module({})
export class RabbitmqModule {
  static forRoot(options: RabbitmqModuleOptions): DynamicModule {
    // Config provider - makes all config available via injection
    const configProvider: Provider = {
      provide: 'RABBITMQ_CONFIG',
      useValue: {
        username: options.username,
        password: options.password,
        dsn: options.dsn,
        appName: options.appName,
        fanoutExchange: options.fanoutExchange,
        directExchange: options.directExchange,
        primaryQueue: options.primaryQueue,
        retryQueue: options.retryQueue,
        retryBindingKey: options.retryBindingKey,
        errorBindingKey: options.errorBindingKey,
        heartbeatInterval: options.heartbeatInterval,
        delayedRetriesNumber: options.delayedRetriesNumber,
        immediateRetriesNumber: options.immediateRetriesNumber,
        retryQueueMessageTtl: options.retryQueueMessageTtl,
        consumeMessageLimit: options.consumeMessageLimit,
        dispatchMessageLimit: options.dispatchMessageLimit,
      },
    };

    return {
      module: RabbitmqModule,
      providers: [
        // Configuration
        configProvider,

        // User-provided implementations
        options.inboxRepoProvider,
        options.outboxRepoProvider,
        options.messageHandlerRegistryProvider,

        // Core RabbitMQ services
        RabbitmqConfigService,
        RabbitmqConnectionService,
        RabbitmqConfigurerService,

        // Message handling services
        InboxMessageHandler,
        OutboxMessageRelay,

        // Consumer and Producer services
        ConsumerService,
        ProducerService,
      ],
      exports: [
        // Export config for use in consuming apps
        'RABBITMQ_CONFIG',

        // Export user-provided implementations
        'INBOX_REPOSITORY',
        'OUTBOX_REPOSITORY',
        'MESSAGE_HANDLER_REGISTRY',

        // Export core services
        RabbitmqConfigService,
        RabbitmqConnectionService,
        RabbitmqConfigurerService,

        // Export message handling services
        InboxMessageHandler,
        OutboxMessageRelay,

        // Export consumer and producer
        ConsumerService,
        ProducerService,
      ],
    };
  }

  // Async configuration support (for ConfigService integration)
  static forRootAsync(options: RabbitmqModuleAsyncOptions): DynamicModule {
    return {
      module: RabbitmqModule,
      imports: options.imports || [],
      providers: [
        // Create async config provider
        {
          provide: 'RABBITMQ_CONFIG',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },

        // User-provided implementations (must be synchronous)
        options.inboxRepoProvider,
        options.outboxRepoProvider,
        options.messageHandlerRegistryProvider,

        // Core RabbitMQ services
        RabbitmqConfigService,
        RabbitmqConnectionService,
        RabbitmqConfigurerService,

        // Message handling services
        InboxMessageHandler,
        OutboxMessageRelay,

        // Consumer and Producer services
        ConsumerService,
        ProducerService,
      ],
      exports: [
        'RABBITMQ_CONFIG',
        'INBOX_REPOSITORY',
        'OUTBOX_REPOSITORY',
        'MESSAGE_HANDLER_REGISTRY',
        RabbitmqConfigService,
        RabbitmqConnectionService,
        RabbitmqConfigurerService,
        InboxMessageHandler,
        OutboxMessageRelay,
        ConsumerService,
        ProducerService,
      ],
    };
  }
}

// Interface for async configuration
export interface RabbitmqModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => Promise<RabbitmqModuleConfig> | RabbitmqModuleConfig;
  inject?: any[];

  // User-provided implementations
  inboxRepoProvider: Provider;
  outboxRepoProvider: Provider;
  messageHandlerRegistryProvider: Provider;
}

// Simplified config interface for async factory
export interface RabbitmqModuleConfig {
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
}
