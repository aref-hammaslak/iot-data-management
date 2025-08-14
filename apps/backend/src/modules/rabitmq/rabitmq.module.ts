import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabitmq.service';
import { XrayModule } from '../xray/xray-signal.module';

@Module({
  imports: [XrayModule],
  controllers: [],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
