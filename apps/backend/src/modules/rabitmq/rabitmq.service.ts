import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Channel, ChannelModel, connect } from 'amqplib';
import { SignalService } from '../xray/signal.service';
import { SaveSignalDto } from '../xray/dtos/save-signal.dto';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: ChannelModel;
  private channel: Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly signalService: SignalService,
  ) {}

  async onModuleInit() {
    try {
      const uri = this.configService.get<string>('rabbitmq.uri');
      if (!uri) {
        throw new Error('RabbitMQ URI is not defined in configuration');
      }
      this.connection = await connect(uri);
      this.channel = await this.connection.createChannel();

      // X-Ray queue
      const xrayQueue = 'x-ray';
      await this.channel.assertQueue(xrayQueue, { durable: true });
      this.addXRaySignalConsumer(xrayQueue);
    } catch (error) {
      this.logger.error('❌ RabbitMQ connection failed', error);
    }
  }

  addXRaySignalConsumer(xrayQueue: string) {
    this.logger.log(`✅ Listening for messages on queue: ${xrayQueue}`);
    this.channel
      .consume(
        xrayQueue,
        (msg) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString()) as SaveSignalDto;
            this.logger.log('📩 Received:', content);
            this.signalService
              .saveSignal(content)
              .then(() => {
                this.channel.ack(msg, false);
              })
              .catch((err) => {
                this.logger.error('❌ Error saving signal', err);
                this.channel.nack(msg, false, false);
              });
          }
        },
        { noAck: false },
      )
      .catch((err) => {
        this.logger.error('❌ Error consuming messages', err);
      });
  }
  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      this.logger.error('❌ Error closing RabbitMQ connection', error);
    }
  }
}
