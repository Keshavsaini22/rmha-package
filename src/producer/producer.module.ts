import { Module } from '@nestjs/common';
import { RabbitmqModule } from '../rabbitmq.module';
import { ProducerService } from './producer.service';

@Module({
  imports: [RabbitmqModule],
  providers: [
    ProducerService,
  ],
})
export class ProducerModule { }
