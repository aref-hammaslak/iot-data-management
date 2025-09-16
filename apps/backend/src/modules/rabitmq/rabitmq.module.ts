import { Module } from '@nestjs/common';
import { XrayModule } from '../xray/xray-signal.module';
import { RabitmqController } from './rabitmq.controller';

@Module({
  imports: [XrayModule],
  controllers: [RabitmqController],
  exports: [],
})
export class RabbitMQModule {}
