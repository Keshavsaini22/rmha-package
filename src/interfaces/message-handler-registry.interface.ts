export interface IMessageHandler {
  getHandlerName(): string;
  handleEvent(message: { messageId: string; body: any }): Promise<void>;
}

export interface IMessageHandlerRegistry {
  getSignatureTypes(): Record<string, Promise<IMessageHandler>[]>;
}
