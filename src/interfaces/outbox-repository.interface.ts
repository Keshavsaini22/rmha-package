import { OutboxMessage } from "../entities/outbox-message.entity";

export interface IOutboxRepository {
  getUnsentMessages(limit: number): Promise<OutboxMessage[]>;
  save(message: OutboxMessage): Promise<OutboxMessage>;
}