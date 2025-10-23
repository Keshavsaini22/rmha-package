import { Module } from '@nestjs/common';
import { RabbitmqModule } from '../rabbitmq.module';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [RabbitmqModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}
