import { InboxMessage } from "../entities/inbox-message.entity";

export interface IInboxRepository {
  getInboxMessageById(messageId: string, handlerName: string): Promise<InboxMessage | null>;
  save(payload: { message_id: string; handler_name: string }): Promise<InboxMessage>;
}