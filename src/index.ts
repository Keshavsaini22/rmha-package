// src/index.ts

// Main module
export * from './rabbitmq.module';

// Services
export * from './services';

// Consumer & Producer
export * from './consumer/consumer.module';
export * from './consumer/consumer.service';
export * from './producer/producer.module';
export * from './producer/producer.service';

// CLI Commands
export * from './cli-commands/dispatch-messages';
export * from './cli-commands/handle-messages';

// Interfaces
export * from './interfaces';

// Entities
export * from './entities';
export { OutboxMessageRelay } from './services/outbox-message-relay.service'; // ✅ Export directly
