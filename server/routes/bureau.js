const express = require('express');
const router = express.Router();
const bureauService = require('../services/bureauService');
const bureauHealthService = require('../services/bureauHealthService');
const EmployeeModel = require('../models/Employee');

// Get consolidated credit score from all bureaus
router.post('/consolidated-score', async (req, res) => {
  try {
    const userData = req.body;
    const result = await bureauService.getConsolidatedScore(userData);
    
    res.json({
      status: 'Success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Get all bureau scores for a user
router.get('/all-scores/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await EmployeeModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }
    
    // Include user ID in userData for caching
    const userData = { ...user.toObject(), _id: userId };
    const results = await bureauService.getAllBureauScores(userData);
    
    res.json({
      status: 'Success',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Refresh credit score for existing user
router.post('/refresh-score/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await EmployeeModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }
    
    // Include user ID in userData for caching
    const userData = { ...user.toObject(), _id: userId };
    const consolidatedResult = await bureauService.getConsolidatedScore(userData);
    
    // Update user record with new scores
    await EmployeeModel.findByIdAndUpdate(userId, {
      creditScore: consolidatedResult.consolidatedScore,
      riskLevel: consolidatedResult.riskLevel,
      cachedCreditScore: consolidatedResult.consolidatedScore,
      lastScoreUpdate: new Date(),
      bureauData: consolidatedResult
    });
    
    res.json({
      status: 'Success',
      message: 'Credit score refreshed successfully',
      data: consolidatedResult
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Get bureau health status
router.get('/health-status', async (req, res) => {
  try {
    const status = bureauHealthService.getBureauStatus();
    res.json({
      status: 'Success',
      data: status
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

module.exports = router;