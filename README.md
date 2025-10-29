# rmha-nestjs

**A modular and production-ready Outbox/Inbox, Event-Driven Messaging, and RabbitMQ integration for NestJS and TypeORM/MikroORM**

[![npm version](https://img.shields.io/npm/v/rmha-nestjs.svg)](https://www.npmjs.com/package/rmha-nestjs)
[![npm downloads](https://img.shields.io/npm/dw/rmha-nestjs.svg)](https://www.npmjs.com/package/rmha-nestjs)

---

## Why rmha-nestjs?

- SOLID event-driven microservice architecture, built for real-world complexity
- Transparent Outbox pattern and Inbox deduplication with database persistency
- Effortless RabbitMQ integration (publish, consume, auto-retry, dead-letter)
- Works with both TypeORM and MikroORM
- Zero-coupling: Bring your entities/repositories, plug & go
- CLI-friendly: run as microservice, worker, batch, or standalone
- Designed and used by engineers for large-scale, distributed NestJS applications

---

## Features

- **Outbox pattern**: Safe, atomic message publication from DB events
- **Inbox pattern**: Exactly-once handling for incoming events
- **RabbitMQ**: Fanout, direct, retry and error queues managed
- **Plug-in ORM:** Integrate with either TypeORM or MikroORM
- **Customizable**: Bring your own event entity, handler, repository adapter
- **Fully typed**: TypeScript-first for safe building
- **Easy testing**: Minimal bootstrap, full CLI
- **Highly configurable**: All exchanges, queues, and routing configurable via options/env
---

## Installation

```bash
npm install rmha-nestjs typeorm mikro-orm amqplib
```

You will also need your own entities and repositories, depending on TypeORM or MikroORM.

---

## Quickstart

Import and configure the module in your `AppModule` or CLI Module:

```typescript
import { RabbitmqModule } from 'rmha-nestjs';

@Module({
  imports: [
    RabbitmqModule.forRoot({
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      dsn: process.env.RABBITMQ_DSN,
      appName: process.env.APP_NAME,
      fanoutExchange: process.env.RABBITMQ_FANOUT_EXCHANGE,
      directExchange: process.env.RABBITMQ_DIRECT_EXCHANGE,
      primaryQueue: 'hospital.patient',
      retryQueue: 'hospital.patient.retry',
      retryBindingKey: 'hospital.patient.retry',
      errorBindingKey: 'hospital.dead-letter',
      heartbeatInterval: 30,
      delayedRetriesNumber: 3,
      immediateRetriesNumber: 5,
      retryQueueMessageTtl: 10000,
      consumeMessageLimit: 10,
      dispatchMessageLimit: 10,
      // outboxRepoProvider/inboxRepoProvider / messageHandlerRegistryProvider: see docs!
    }),
  ],
})
export class AppModule {}
```

**For usage with TypeORM/MikroORM, see `examples` directory.**

---

## Outbox Pattern Example

```typescript
const outboxEntity = new OutboxMessage({...});
await repo.storeOutboxMessage(outboxEntity, transactionalEntityManager);
// Later: rmha-nestjs dispatch picks unsent events and publishes to RabbitMQ
```

---

## Inbox Pattern Example

```typescript
await repo.storeInboxMessage({
  message_id: message.messageId,
  handler_name: handler.constructor.name,
}, transactionalEntityManager);
// Ensures deduplication for exactly once
```

---

## CLI Usage

### Dispatch Outbox
```bash
node dist/path/to/cli.patient.js dispatch-messages
```

### Consume Inbox
```bash
node dist/path/to/cli.doctor.consumer.js consume-messages
```

---

## Configuration

All options can be set via `forRoot()` or environment variables.
- See [examples](./examples) for a typical `.env`

---

## Advanced
- Custom repository adapters for TypeORM/MikroORM
- Completely pluggable: inject your own domain logic, adapters, events
- Use as library or as dedicated worker/CLI

---

## Documentation & Examples

- See [Event Driven Architecture](https://github.com/Keshavsaini22/NestJs-Poc--Typeorm-Problem-Details-EDA-API-Locking) for real app setups!
- More guides coming soon!

---

## Contributing
PRs, issues, suggestions welcome

---

## Tags

event-driven, nestjs, rabbitmq, outbox, inbox, typeorm, mikroorm, microservices, distributed-systems, reliable-messaging, cli, fanout, direct, dead-letter, transactional, deduplication, nodejs, queue, scalable

---

## License
MIT
