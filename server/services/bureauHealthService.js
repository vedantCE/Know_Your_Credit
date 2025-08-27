class BureauHealthService {
  constructor() {
    this.bureauStatus = {
      CIBIL: { status: 'UP', lastCheck: new Date(), responseTime: 0 },
      EXPERIAN: { status: 'UP', lastCheck: new Date(), responseTime: 0 },
      EQUIFAX: { status: 'UP', lastCheck: new Date(), responseTime: 0 },
      CRIF: { status: 'UP', lastCheck: new Date(), responseTime: 0 }
    };
    this.startHealthChecks();
  }

  async checkBureauHealth(bureauName) {
    const startTime = Date.now();
    try {
      // Simulate health check with random failure
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));
      
      const isDown = Math.random() < 0.3; // 30% chance of being down
      const responseTime = Date.now() - startTime;
      
      this.bureauStatus[bureauName] = {
        status: isDown ? 'DOWN' : responseTime > 2000 ? 'SLOW' : 'UP',
        lastCheck: new Date(),
        responseTime,
        uptime: this.calculateUptime(bureauName)
      };
      
      return this.bureauStatus[bureauName];
    } catch (error) {
      this.bureauStatus[bureauName] = {
        status: 'DOWN',
        lastCheck: new Date(),
        responseTime: Date.now() - startTime,
        error: error.message,
        uptime: this.calculateUptime(bureauName)
      };
      return this.bureauStatus[bureauName];
    }
  }

  calculateUptime(bureauName) {
    // Mock uptime calculation
    return Math.random() * 5 + 95; // 95-100% uptime
  }

  async checkAllBureaus() {
    const promises = Object.keys(this.bureauStatus).map(bureau => 
      this.checkBureauHealth(bureau)
    );
    await Promise.all(promises);
    return this.bureauStatus;
  }

  getBureauStatus() {
    return this.bureauStatus;
  }

  // Sync with mock API status
  syncWithMockAPI() {
    try {
      const mockBureauAPIs = require('./mockBureauAPIs');
      const mockStatus = mockBureauAPIs.getHealthStatus();
      this.bureauStatus = mockStatus.data;
    } catch (error) {
      console.log('Mock API not available, using random status');
    }
  }

  startHealthChecks() {
    // Sync with mock API every 30 seconds
    setInterval(() => {
      this.syncWithMockAPI();
    }, 30000);
    
    // Initial sync
    this.syncWithMockAPI();
  }

  getAvailableBureaus() {
    return Object.entries(this.bureauStatus)
      .filter(([_, status]) => status.status === 'UP')
      .map(([name, _]) => name);
  }
}

module.exports = new BureauHealthService();