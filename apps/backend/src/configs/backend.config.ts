export const backendConfig = () => ({
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/pantohealth',
  },
});
