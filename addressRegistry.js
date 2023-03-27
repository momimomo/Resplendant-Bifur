class AddressRegistry {
    constructor() {
      this.addressMap = new Map();
    }
  
    register(address, worker) {
      this.addressMap.set(address, worker);
    }
  
    unregister(address) {
      this.addressMap.delete(address);
    }
  
    getWorkerByAddress(address) {
      return this.addressMap.get(address);
    }
  }
  
  module.exports = AddressRegistry;
  