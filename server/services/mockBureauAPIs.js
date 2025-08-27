// Mock Bureau APIs - Simulates real credit bureau services
// No real API keys needed - fully functional mock implementation

class MockBureauAPIs {
  constructor() {
    this.apiStatus = {
      CIBIL: { status: 'DOWN', lastCheck: new Date(), responseTime: 0, uptime: 97.2 },
      EXPERIAN: { status: 'UP', lastCheck: new Date(), responseTime: 95, uptime: 99.5 },
      EQUIFAX: { status: 'SLOW', lastCheck: new Date(), responseTime: 340, uptime: 98.2 },
      CRIF: { status: 'UP', lastCheck: new Date(), responseTime: 85, uptime: 99.9 }
    };
    
    // Start health monitoring
    this.startHealthMonitoring();
  }

  // Simulate network delays and failures
  async simulateAPICall(bureauName, baseDelay = 200) {
    const startTime = Date.now();
    
    // Random network delay (100ms - 2000ms)
    const networkDelay = baseDelay + Math.random() * 1800;
    
    // Simulate network issues (5% chance of timeout)
    const hasNetworkIssue = Math.random() < 0.05;
    
    if (hasNetworkIssue) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s timeout
      throw new Error(`${bureauName} API timeout`);
    }
    
    // Normal delay
    await new Promise(resolve => setTimeout(resolve, networkDelay));
    
    const responseTime = Date.now() - startTime;
    
    // Update status based on response time
    this.apiStatus[bureauName] = {
      status: responseTime > 2000 ? 'SLOW' : 'UP',
      lastCheck: new Date(),
      responseTime,
      uptime: this.calculateUptime(bureauName)
    };
    
    return responseTime;
  }

  // CIBIL Mock API
  async getCIBILScore(panNumber, personalDetails) {
    try {
      const responseTime = await this.simulateAPICall('CIBIL', 150);
      
      // Generate consistent score based on PAN
      const seed = this.generateSeed(panNumber);
      const baseScore = 600 + (seed % 300);
      
      return {
        success: true,
        bureau: 'CIBIL',
        score: baseScore,
        range: '300-900',
        reportDate: new Date().toISOString(),
        factors: {
          paymentHistory: Math.min(100, 70 + (seed % 30)),
          creditUtilization: Math.min(100, 60 + (seed % 40)),
          creditAge: Math.min(100, 50 + (seed % 50)),
          creditMix: Math.min(100, 65 + (seed % 35)),
          newCredit: Math.min(100, 75 + (seed % 25))
        },
        accounts: this.generateMockAccounts(seed, 'CIBIL'),
        responseTime
      };
    } catch (error) {
      this.apiStatus.CIBIL.status = 'DOWN';
      throw error;
    }
  }

  // Experian Mock API
  async getExperianScore(panNumber, personalDetails) {
    try {
      const responseTime = await this.simulateAPICall('EXPERIAN', 180);
      
      const seed = this.generateSeed(panNumber);
      const baseScore = 580 + (seed % 320);
      
      return {
        success: true,
        bureau: 'EXPERIAN',
        score: baseScore,
        range: '300-900',
        reportDate: new Date().toISOString(),
        riskGrade: baseScore >= 750 ? 'A' : baseScore >= 650 ? 'B' : baseScore >= 550 ? 'C' : 'D',
        factors: {
          paymentBehavior: Math.min(100, 65 + (seed % 35)),
          accountUtilization: Math.min(100, 55 + (seed % 45)),
          accountAge: Math.min(100, 45 + (seed % 55)),
          accountTypes: Math.min(100, 70 + (seed % 30)),
          recentActivity: Math.min(100, 80 + (seed % 20))
        },
        accounts: this.generateMockAccounts(seed, 'EXPERIAN'),
        responseTime
      };
    } catch (error) {
      this.apiStatus.EXPERIAN.status = 'DOWN';
      throw error;
    }
  }

  // Equifax Mock API
  async getEquifaxScore(panNumber, personalDetails) {
    try {
      const responseTime = await this.simulateAPICall('EQUIFAX', 220);
      
      const seed = this.generateSeed(panNumber);
      const baseScore = 620 + (seed % 280);
      
      return {
        success: true,
        bureau: 'EQUIFAX',
        score: baseScore,
        range: '300-900',
        reportDate: new Date().toISOString(),
        riskCategory: baseScore >= 750 ? 'LOW' : baseScore >= 650 ? 'MEDIUM' : 'HIGH',
        factors: {
          repaymentHistory: Math.min(100, 75 + (seed % 25)),
          balanceUtilization: Math.min(100, 50 + (seed % 50)),
          creditHistory: Math.min(100, 40 + (seed % 60)),
          creditPortfolio: Math.min(100, 60 + (seed % 40)),
          inquiries: Math.min(100, 85 + (seed % 15))
        },
        accounts: this.generateMockAccounts(seed, 'EQUIFAX'),
        responseTime
      };
    } catch (error) {
      this.apiStatus.EQUIFAX.status = 'DOWN';
      throw error;
    }
  }

  // CRIF Mock API
  async getCRIFScore(panNumber, personalDetails) {
    try {
      const responseTime = await this.simulateAPICall('CRIF', 160);
      
      const seed = this.generateSeed(panNumber);
      const baseScore = 650 + (seed % 349); // CRIF range 1-999
      
      return {
        success: true,
        bureau: 'CRIF',
        score: baseScore,
        range: '1-999',
        reportDate: new Date().toISOString(),
        scoreClass: baseScore >= 800 ? 'EXCELLENT' : baseScore >= 700 ? 'GOOD' : baseScore >= 600 ? 'FAIR' : 'POOR',
        factors: {
          creditBehavior: Math.min(100, 80 + (seed % 20)),
          creditExposure: Math.min(100, 45 + (seed % 55)),
          creditVintage: Math.min(100, 35 + (seed % 65)),
          creditDiversity: Math.min(100, 55 + (seed % 45)),
          creditInquiries: Math.min(100, 90 + (seed % 10))
        },
        accounts: this.generateMockAccounts(seed, 'CRIF'),
        responseTime
      };
    } catch (error) {
      this.apiStatus.CRIF.status = 'DOWN';
      throw error;
    }
  }

  // Generate consistent seed from PAN
  generateSeed(panNumber) {
    return panNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  // Generate mock credit accounts
  generateMockAccounts(seed, bureau) {
    const accountTypes = ['Credit Card', 'Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan'];
    const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra'];
    
    const numAccounts = 2 + (seed % 4); // 2-5 accounts
    const accounts = [];
    
    for (let i = 0; i < numAccounts; i++) {
      const accountSeed = seed + i * 17;
      accounts.push({
        accountType: accountTypes[accountSeed % accountTypes.length],
        bank: banks[accountSeed % banks.length],
        accountNumber: `****${(1000 + accountSeed % 9000)}`,
        openDate: new Date(2020 + (accountSeed % 4), accountSeed % 12, 1 + (accountSeed % 28)).toISOString().split('T')[0],
        currentBalance: (accountSeed % 500000) + 10000,
        creditLimit: (accountSeed % 1000000) + 50000,
        paymentStatus: accountSeed % 10 === 0 ? 'Late' : 'Current',
        monthsReviewed: 12 + (accountSeed % 24)
      });
    }
    
    return accounts;
  }

  // Health monitoring
  startHealthMonitoring() {
    setInterval(() => {
      Object.keys(this.apiStatus).forEach(bureau => {
        // Random status changes for demo
        const random = Math.random();
        if (bureau === 'CIBIL') {
          // CIBIL down only 10% of the time instead of always
          if (random < 0.1) {
            this.apiStatus[bureau].status = 'DOWN';
            this.apiStatus[bureau].responseTime = 0;
          } else if (random < 0.2) {
            this.apiStatus[bureau].status = 'SLOW';
            this.apiStatus[bureau].responseTime = 250 + Math.random() * 300;
          } else {
            this.apiStatus[bureau].status = 'UP';
            this.apiStatus[bureau].responseTime = 80 + Math.random() * 200;
          }
        } else if (bureau === 'EQUIFAX') {
          // Keep EQUIFAX slow for demo  
          this.apiStatus[bureau].status = 'SLOW';
          this.apiStatus[bureau].responseTime = 300 + Math.random() * 200;
        } else {
          // Normal random behavior for others
          if (random < 0.05) {
            this.apiStatus[bureau].status = 'DOWN';
            this.apiStatus[bureau].responseTime = 0;
          } else if (random < 0.15) {
            this.apiStatus[bureau].status = 'SLOW';
            this.apiStatus[bureau].responseTime = 250 + Math.random() * 300;
          } else {
            this.apiStatus[bureau].status = 'UP';
            this.apiStatus[bureau].responseTime = 80 + Math.random() * 200;
          }
        }
        
        this.apiStatus[bureau].lastCheck = new Date();
        this.apiStatus[bureau].uptime = this.calculateUptime(bureau);
      });
    }, 600000); // Check every 10 minutes (600 seconds)
  }

  calculateUptime(bureau) {
    // Mock uptime calculation with bureau-specific baselines
    const baselines = {
      CIBIL: 99.5,
      EXPERIAN: 99.2, 
      EQUIFAX: 97.8,
      CRIF: 99.7
    };
    const baseline = baselines[bureau] || 98.0;
    return Math.max(95.0, baseline + (Math.random() - 0.5) * 2); // ±1% variation
  }

  // Get all bureau scores for a customer
  async getAllBureauScores(panNumber, personalDetails) {
    const results = {};
    const errors = {};
    
    // Call all bureaus in parallel
    const promises = [
      this.getCIBILScore(panNumber, personalDetails).catch(err => ({ error: err.message, bureau: 'CIBIL' })),
      this.getExperianScore(panNumber, personalDetails).catch(err => ({ error: err.message, bureau: 'EXPERIAN' })),
      this.getEquifaxScore(panNumber, personalDetails).catch(err => ({ error: err.message, bureau: 'EQUIFAX' })),
      this.getCRIFScore(panNumber, personalDetails).catch(err => ({ error: err.message, bureau: 'CRIF' }))
    ];
    
    const responses = await Promise.all(promises);
    
    responses.forEach(response => {
      if (response.error) {
        errors[response.bureau] = response.error;
      } else {
        results[response.bureau] = response;
      }
    });
    
    // Calculate consolidated score from available bureaus
    const availableScores = Object.values(results).map(r => r.score);
    const consolidatedScore = availableScores.length > 0 
      ? Math.round(availableScores.reduce((sum, score) => sum + score, 0) / availableScores.length)
      : null;
    
    return {
      success: true,
      consolidatedScore,
      bureauResults: results,
      errors,
      availableBureaus: Object.keys(results),
      timestamp: new Date().toISOString()
    };
  }

  // Get current API health status
  getHealthStatus() {
    return {
      status: 'Success',
      data: this.apiStatus,
      timestamp: new Date().toISOString()
    };
  }

  // Manual status control (for testing)
  setBureauStatus(bureau, status) {
    if (this.apiStatus[bureau]) {
      this.apiStatus[bureau].status = status;
      this.apiStatus[bureau].lastCheck = new Date();
      return true;
    }
    return false;
  }
}

module.exports = new MockBureauAPIs();