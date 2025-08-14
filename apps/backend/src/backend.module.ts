import { Module } from '@nestjs/common';
import { backendConfig } from './configs/backend.config';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { RabbitMQModule } from './modules/rabitmq/rabitmq.module';
import { XrayModule } from './modules/xray/xray-signal.module';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule,
    XrayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [backendConfig],
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class BackendModule {}
