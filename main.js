const { Worker } = require("worker_threads");
const AddressRegistry = require("./addressRegistry.js");
const Supervisor = require("./supervisor.js");
const RoundRobinRouter = require("./roundRobinRouter.js");

const addressRegistry = new AddressRegistry();
const supervisor = new Supervisor();
const router = new RoundRobinRouter();

// Create and register multiple Workers
const numWorkers = 4;
const workerAddresses = [];

for (let i = 0; i < numWorkers; i++) {

  // regular worker without using RabbitMQ
  // const worker = supervisor.createChild('./worker.js');

  // worker using RabbitMQ
  const worker = supervisor.createChild("./clusterWorker.js");

  worker.on("message", (message) => {
    console.log(
      `Received message in main script from Worker ${worker.threadId}: ${message}`
    );
  });

  const workerAddress = `worker-${i + 1}`;
  addressRegistry.register(workerAddress, worker);
  workerAddresses.push(workerAddress);

  router.addWorker(worker);
}

// Send messages to the Workers using the round-robin router
for (let i = 0; i < 10; i++) {
  const message = `Hello, Worker! Message ${i + 1}`;
  router.routeMessage(message);
}
