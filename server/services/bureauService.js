const bureauHealthService = require('./bureauHealthService');

class BureauService {
  constructor() {
    this.bureaus = {
      CIBIL: {
        name: 'CIBIL TransUnion',
        weightage: 0.4,
        scoreRange: [300, 900],
        enabled: true
      },
      EXPERIAN: {
        name: 'Experian',
        weightage: 0.25,
        scoreRange: [300, 850],
        enabled: true
      },
      EQUIFAX: {
        name: 'Equifax',
        weightage: 0.25,
        scoreRange: [280, 850],
        enabled: true
      },
      CRIF: {
        name: 'CRIF High Mark',
        weightage: 0.1,
        scoreRange: [300, 900],
        enabled: true
      }
    };
  }

  async getCreditScore(userData, bureauName = 'CIBIL') {
    try {
      const bureau = this.bureaus[bureauName];
      const healthStatus = bureauHealthService.getBureauStatus()[bureauName];
      
      if (!bureau || !bureau.enabled || healthStatus.status === 'DOWN') {
        return this.getFallbackScore(userData, bureauName, 'Bureau unavailable');
      }

      const response = await this.callBureauAPI(bureauName, userData);
      
      // Cache successful score in database if user ID exists
      if (userData._id && response.creditScore) {
        try {
          const EmployeeModel = require('../models/Employee');
          await EmployeeModel.findByIdAndUpdate(userData._id, {
            cachedCreditScore: response.creditScore,
            lastScoreUpdate: new Date()
          });
        } catch (cacheError) {
          console.log('Failed to cache score:', cacheError.message);
        }
      }
      
      return {
        score: response.creditScore,
        riskLevel: this.calculateRiskLevel(response.creditScore),
        bureau: bureauName,
        reportDate: new Date(),
        factors: response.factors || [],
        bureauStatus: healthStatus.status
      };
    } catch (error) {
      console.error(`Bureau API error for ${bureauName}:`, error.message);
      return this.getFallbackScore(userData, bureauName, error.message);
    }
  }

  async callBureauAPI(bureauName, userData) {
    const bureau = this.bureaus[bureauName];
    
    return new Promise(resolve => {
      setTimeout(() => {
        const baseScore = this.calculateBaseScore(userData);
        const [min, max] = bureau.scoreRange;
        const bureauScore = Math.min(max, Math.max(min, 
          baseScore + this.getBureauVariation(bureauName)
        ));
        
        resolve({
          creditScore: bureauScore,
          bureau: bureauName,
          factors: this.getBureauFactors(bureauName, userData),
          reportId: `${bureauName}_${Date.now()}`,
          timestamp: new Date()
        });
      }, Math.random() * 2000 + 500); // 0.5-2.5s delay
    });
  }

  calculateBaseScore(userData) {
    let score = 300;
    
    const income = parseInt(userData.annualIncome?.replace(/[^0-9]/g, '') || '0');
    if (income > 1000000) score += 200;
    else if (income > 500000) score += 150;
    else if (income > 300000) score += 100;
    else score += 50;
    
    if (userData.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear();
      if (age >= 25 && age <= 45) score += 100;
      else if (age >= 18 && age <= 60) score += 70;
      else score += 30;
    } else score += 50;
    
    if (userData.occupation) {
      const job = userData.occupation.toLowerCase();
      if (job.includes('engineer') || job.includes('manager')) score += 150;
      else if (job.includes('business') || job.includes('professional')) score += 120;
      else score += 80;
    } else score += 50;
    
    return Math.min(900, Math.max(300, score));
  }

  calculateRiskLevel(score) {
    if (score >= 750) return 'Low';
    if (score >= 650) return 'Medium';
    return 'High';
  }

  getBureauVariation(bureauName) {
    const variations = {
      CIBIL: Math.floor(Math.random() * 40) - 20,
      EXPERIAN: Math.floor(Math.random() * 60) - 30,
      EQUIFAX: Math.floor(Math.random() * 50) - 25,
      CRIF: Math.floor(Math.random() * 70) - 35
    };
    return variations[bureauName] || 0;
  }

  getBureauFactors(bureauName, userData) {
    const commonFactors = {
      CIBIL: [
        'Payment History: 35%',
        'Credit Utilization: 30%',
        'Length of Credit History: 15%',
        'Credit Mix: 10%',
        'New Credit: 10%'
      ],
      EXPERIAN: [
        'Payment History: Good',
        'Credit Usage: Moderate',
        'Account Age: 4+ years',
        'Credit Inquiries: Low'
      ],
      EQUIFAX: [
        'Repayment Track Record: Excellent',
        'Credit Exposure: 45%',
        'Credit History Length: 5 years',
        'Credit Type Mix: Balanced'
      ],
      CRIF: [
        'Payment Behavior: Consistent',
        'Outstanding Debt: Manageable',
        'Credit Account Diversity: Good',
        'Recent Credit Activity: Normal'
      ]
    };
    return commonFactors[bureauName] || [];
  }

  async getAllBureauScores(userData) {
    const results = {};
    
    for (const [bureauName, bureau] of Object.entries(this.bureaus)) {
      try {
        results[bureauName] = await this.getCreditScore(userData, bureauName);
      } catch (error) {
        results[bureauName] = {
          error: error.message,
          bureau: bureauName,
          reportDate: new Date()
        };
      }
    }
    
    return results;
  }

  async getConsolidatedScore(userData) {
    const results = await this.getAllBureauScores(userData);
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const [bureauName, result] of Object.entries(results)) {
      if (result.score && !result.error) {
        const weight = this.bureaus[bureauName].weightage;
        weightedSum += result.score * weight;
        totalWeight += weight;
      }
    }
    
    const consolidatedScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : this.calculateBaseScore(userData);
    
    const consolidatedResult = {
      consolidatedScore,
      riskLevel: this.calculateRiskLevel(consolidatedScore),
      bureauResults: results,
      reportDate: new Date()
    };
    
    // Cache consolidated score in database if user ID exists
    if (userData._id && consolidatedScore) {
      try {
        const EmployeeModel = require('../models/Employee');
        await EmployeeModel.findByIdAndUpdate(userData._id, {
          cachedCreditScore: consolidatedScore,
          lastScoreUpdate: new Date(),
          bureauData: consolidatedResult
        });
      } catch (cacheError) {
        console.log('Failed to cache consolidated score:', cacheError.message);
      }
    }
    
    return consolidatedResult;
  }

  getFallbackScore(userData, bureauName = 'INTERNAL', reason = 'Bureau unavailable') {
    // Priority 1: Use cached score from database if available
    if (userData.cachedCreditScore && userData.cachedCreditScore > 0) {
      return {
        score: userData.cachedCreditScore,
        riskLevel: this.calculateRiskLevel(userData.cachedCreditScore),
        bureau: bureauName,
        reportDate: userData.lastScoreUpdate || new Date(),
        factors: [`Cached score from ${userData.lastScoreUpdate ? new Date(userData.lastScoreUpdate).toLocaleDateString() : 'previous calculation'}`],
        bureauStatus: 'CACHED'
      };
    }
    
    // Priority 2: Use bureau data cache if available
    if (userData.bureauData && userData.bureauData.consolidatedScore) {
      return {
        score: userData.bureauData.consolidatedScore,
        riskLevel: this.calculateRiskLevel(userData.bureauData.consolidatedScore),
        bureau: bureauName,
        reportDate: userData.bureauData.reportDate || new Date(),
        factors: ['Cached bureau data'],
        bureauStatus: 'CACHED'
      };
    }
    
    // Priority 3: Fallback to internal algorithm
    const score = this.calculateBaseScore(userData);
    return {
      score,
      riskLevel: this.calculateRiskLevel(score),
      bureau: bureauName,
      reportDate: new Date(),
      factors: [reason],
      bureauStatus: 'FALLBACK'
    };
  }
}

module.exports = new BureauService();