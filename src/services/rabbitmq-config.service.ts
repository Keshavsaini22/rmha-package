import { Injectable } from '@nestjs/common';
import * as RabbitMQ from 'amqplib';
import { ConfigType } from '../interfaces';

@Injectable()
export class RabbitmqConfigService {
  private config: ConfigType;

  // ✅ Remove constructor parameter - no ConfigService!
  constructor() {}

  // Accept config directly instead of from ConfigService
  setConfig(config: any): void {
    this.config = {
      username: config.username,
      password: config.password,
      appName: config.appName,
      fanoutExchange: config.fanoutExchange,
      heartbeatInterval: config.heartbeatInterval,
      dsn: config.dsn,
      directExchange: config.directExchange,
      primaryQueue: config.primaryQueue,
      retryQueue: config.retryQueue,
      retryBindingKey: config.retryBindingKey,
      errorBindingKey: config.errorBindingKey,
      delayedRetriesNumber: config.delayedRetriesNumber,
      immediateRetriesNumber: config.immediateRetriesNumber,
      retryQueueMessageTtl: config.retryQueueMessageTtl,
      consumeMessageLimit: config.consumeMessageLimit,
      dispatchMessageLimit: config.dispatchMessageLimit,
    };

    this.validateConfig();
  }

  public validateConfig() {
    const requiredVariables = [
      'username',
      'password',
      'appName',
      'fanoutExchange',
      'directExchange',
      'primaryQueue',
      'retryQueue',
      'retryBindingKey',
      'errorBindingKey',
      'delayedRetriesNumber',
      'immediateRetriesNumber',
      'retryQueueMessageTtl',
      'dsn',
      'heartbeatInterval',
    ];

    const missingVariables = requiredVariables.filter(
      (variable) => !this.config[variable],
    );

    if (missingVariables.length > 0) {
      missingVariables.forEach((variable) => {
        console.error(`Missing required config variable: ${variable}`);
      });
      throw new Error('Missing required RabbitMQ configuration');
    } else {
      console.log('✅ All RabbitMQ configuration prerequisites are met');
    }
  }

  getConfig() {
    return this.config;
  }

  getConnectionString() {
    return this.config.dsn;
  }

  getConnectionParams() {
    return {
      credentials: RabbitMQ.credentials.plain(
        this.config.username,
        this.config.password,
      ),
      heartbeat: this.config.heartbeatInterval || 30,
    };
  }

  getMaxReconnectTrialsData() {
    return {
      maxReconnectTries: 3,
      reconnectPolicy: true,
    };
  }
}
