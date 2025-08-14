import { XrayProducerSimulator } from './producer';

async function main() {
  const producer = new XrayProducerSimulator();
  await producer.init();
  await producer.start();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
