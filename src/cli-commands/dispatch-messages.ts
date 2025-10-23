import { Command, CommandRunner, Option } from 'nest-commander';
import { OutboxMessageRelay } from '../services/outbox-message-relay.service';

interface BasicCommandOptions {
  limit: number;
}

@Command({ name: 'dispatch-messages', description: 'dispatch messages' })
export class DispatchMessages extends CommandRunner {
  constructor(private readonly outboxMessageRelay: OutboxMessageRelay) {
    super();
  }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    await this.outboxMessageRelay.dispatchMessages(options.limit);
    process.exit(0);
  }

  @Option({
    flags: '-l, --limit <limit>',
    description: 'Limit option',
    defaultValue: 10,
  })
  parseLimit(val: string): number {
    return Number(val);
  }
}
