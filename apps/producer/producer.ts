import { connect, Channel } from 'amqplib';
import { randomUUID } from 'crypto';

const XRAY_QUEUE = process.env.XRAY_QUEUE || 'x-ray';
const RABBITMQ_URL = process.env.RABBITMQ_URI || 'amqp://localhost';

interface SaveSignalDto {
  deviceId: string;
  time: number;
  data: [number, [number, number, number]][];
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
    const packet = {
      pattern: 'x-ray-signal',
      data: data,
    };
    return this.channel.sendToQueue(
      XRAY_QUEUE,
      Buffer.from(JSON.stringify(packet)),
      { persistent: true },
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
    //generate random data length between 1 and 5
    const dataLength = Math.floor(Math.random() * 5) + 1;

    //generate random data between 0 and 100
    const data: [number, [number, number, number]][] = Array.from(
      Array(dataLength),
      () => [
        Math.floor(Math.random() * 100),
        [
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
        ],
      ],
    );
    return {
      deviceId: randomUUID(),
      time: Date.now(),
      data,
    };
  }
}
