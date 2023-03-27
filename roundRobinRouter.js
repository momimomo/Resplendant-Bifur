class RoundRobinRouter {
    constructor() {
      this.workers = [];
      this.currentWorkerIndex = 0;
    }
  
    addWorker(worker) {
      this.workers.push(worker);
    }
  
    removeWorker(worker) {
      this.workers = this.workers.filter((w) => w !== worker);
    }
  
    routeMessage(message) {
      if (this.workers.length === 0) {
        throw new Error('No workers available for routing');
      }
  
      const targetWorker = this.workers[this.currentWorkerIndex];
      targetWorker.postMessage(message);
  
      // Update the current worker index for the next message
      this.currentWorkerIndex = (this.currentWorkerIndex + 1) % this.workers.length;
    }
  }
  
  module.exports = RoundRobinRouter;
  