import { Command, CommandRunner, Option } from 'nest-commander';
import { ConsumerService } from '../consumer/consumer.service';
interface BasicCommandOptions {
  limit: number;
}

@Command({ name: 'handle-messages', description: 'handle messages' })
export class HandleMessages extends CommandRunner {
  constructor(private readonly consumerService: ConsumerService) {
    super();
  }

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    await this.consumerService.consumeMessage(options.limit);
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
