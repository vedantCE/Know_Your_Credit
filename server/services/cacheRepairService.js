const EmployeeModel = require('../models/Employee');
const bureauService = require('./bureauService');

class CacheRepairService {
  constructor() {
    this.isRunning = false;
    this.startScheduledRepair();
  }

  async repairMissingCaches() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      console.log('Starting cache repair job...');
      
      const usersWithoutCache = await EmployeeModel.find({
        $or: [
          { cachedCreditScore: 0 },
          { cachedCreditScore: { $exists: false } },
          { cachedCreditScore: null }
        ]
      }).limit(50); // Process in batches

      console.log(`Found ${usersWithoutCache.length} users with missing cache`);

      for (const user of usersWithoutCache) {
        try {
          const score = bureauService.calculateBaseScore(user);
          await this.cacheScoreWithRetry(user._id, score);
          console.log(`Repaired cache for user: ${user.email}`);
        } catch (error) {
          console.log(`Failed to repair cache for user ${user.email}:`, error.message);
        }
      }

      console.log('Cache repair job completed');
    } catch (error) {
      console.error('Cache repair job failed:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  async cacheScoreWithRetry(userId, score, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await EmployeeModel.findByIdAndUpdate(userId, {
          cachedCreditScore: score,
          lastScoreUpdate: new Date(),
          riskLevel: score >= 750 ? 'Low' : score >= 650 ? 'Medium' : 'High'
        });
        return true;
      } catch (error) {
        if (i === retries - 1) {
          console.log(`Cache failed after ${retries} retries for user ${userId}`);
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return false;
  }

  async getCacheStats() {
    try {
      const totalUsers = await EmployeeModel.countDocuments();
      const usersWithCache = await EmployeeModel.countDocuments({
        cachedCreditScore: { $gt: 0 }
      });
      const usersWithoutCache = totalUsers - usersWithCache;

      return {
        totalUsers,
        usersWithCache,
        usersWithoutCache,
        cacheHitRate: ((usersWithCache / totalUsers) * 100).toFixed(2) + '%'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  startScheduledRepair() {
    // Run cache repair every 6 hours
    setInterval(() => {
      this.repairMissingCaches();
    }, 6 * 60 * 60 * 1000);

    // Run initial repair after 30 seconds
    setTimeout(() => {
      this.repairMissingCaches();
    }, 30000);
  }
}

module.exports = new CacheRepairService();