import { connect, Channel } from 'amqplib';
import { randomUUID } from 'crypto';

const XRAY_QUEUE = process.env.XRAY_QUEUE || 'x-ray';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

interface SaveSignalDto {
  deviceId: string;
  time: number;
  data: [number, [number, number, number]];
}

export class XrayProducerSimulator {
  private channel!: Channel;
  private readonly PRODUCER_INTERVAL_SECONDS = 1;
  private readonly LOG_INTERVAL_MESSAGES = 10;

  async init() {
    const connection = await connect(RABBITMQ_URL);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(XRAY_QUEUE, { durable: true });
  }

  sendXrayData(data: SaveSignalDto) {
    return this.channel.sendToQueue(
      XRAY_QUEUE,
      Buffer.from(JSON.stringify(data)),
    );
  }

  async start() {
    console.log('Starting producer...');
    let counter = 0;
    while (true) {
      const data = this.generateData();
      this.sendXrayData(data);
      await new Promise((resolve) =>
        setTimeout(resolve, this.PRODUCER_INTERVAL_SECONDS * 1000),
      );
      counter++;
      if (counter % this.LOG_INTERVAL_MESSAGES === 0) {
        console.log(`Sent ${counter} messages`);
      }
    }
  }

  generateData(): SaveSignalDto {
    const data: SaveSignalDto = {
      deviceId: randomUUID(),
      time: Date.now(),
      data: [Math.random(), [Math.random(), Math.random(), Math.random()]],
    };
    return data;
  }
}
