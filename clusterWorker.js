const amqp = require('amqplib/callback_api');
const { parentPort } = require('worker_threads');

const RABBITMQ_URL = 'amqp://localhost';
const WORKER_QUEUE = 'worker_queue';

// Connect to RabbitMQ and set up a message consumer
amqp.connect(RABBITMQ_URL, (err, connection) => {
  if (err) {
    console.error('Failed to connect to RabbitMQ:', err);
    return;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.error('Failed to create channel:', err);
      return;
    }

    channel.assertQueue(WORKER_QUEUE, { durable: true });

    console.log('Waiting for messages in the queue...');

    channel.consume(
      WORKER_QUEUE,
      (msg) => {
        const message = JSON.parse(msg.content.toString());

        console.log(`Received message in Cluster Worker:`, message);

        // Process the message and perform any required actions
        // ...

        // Optionally, send a response back to the main script
        parentPort.postMessage(`Processed message: ${message.text}`);
      },
      { noAck: true }
    );
  });
});

// Send a message to RabbitMQ when receiving a message from the parent script
parentPort.on('message', (message) => {
  amqp.connect(RABBITMQ_URL, (err, connection) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error('Failed to create channel:', err);
        return;
      }

      channel.assertQueue(WORKER_QUEUE, { durable: true });

      const messageBuffer = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(WORKER_QUEUE, messageBuffer);
    });
  });
});
