const { Worker, parentPort } = require('worker_threads');

class Supervisor {
  constructor() {
    this.children = new Map();
  }

  createChild(workerScript, options) {
    const childWorker = new Worker(workerScript, options);

    childWorker.on('message', (message) => {
      // Handle messages from the child Worker
      const messageFromChild = message;
      console.log(`Message received from child worker : ${messageFromChild}`)
      // ...
    });

    childWorker.on('error', (error) => {
      // Handle errors in the child Worker
      this.handleFailure(childWorker, error);
    });

    childWorker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        this.handleFailure(childWorker, new Error(`Worker exited with code ${code}`));
      }
    });

    // Store the child Worker using its ID
    this.children.set(childWorker.threadId, childWorker);

    return childWorker;
  }

  handleFailure(childWorker, error) {
    // Implement a supervision strategy, e.g., restart, stop, or escalate
    console.error(`Handling failure in Worker ${childWorker.threadId}:`, error);

    // Example: Restart the child Worker
    this.restartChild(childWorker);
  }

  restartChild(childWorker) {
    const newChildWorker = this.createChild(childWorker.filename);

    // Replace the failed Worker with the new Worker
    this.children.set(newChildWorker.threadId, newChildWorker);

    // Terminate the failed Worker
    childWorker.terminate();
  }
}

module.exports = Supervisor;
