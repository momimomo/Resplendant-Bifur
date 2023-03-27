const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
  console.log(`Received message in Worker: ${message}`);

  // Process the message and perform any required actions
  const messageToParent = message;

  // Optionally, send a response back to the parent
  parentPort.postMessage(`Processed message: ${messageToParent}`);
});
