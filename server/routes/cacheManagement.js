const express = require('express');
const router = express.Router();
const cacheRepairService = require('../services/cacheRepairService');
const EmployeeModel = require('../models/Employee');

// Get cache statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await cacheRepairService.getCacheStats();
    res.json({
      status: 'Success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Manually trigger cache repair
router.post('/repair', async (req, res) => {
  try {
    await cacheRepairService.repairMissingCaches();
    res.json({
      status: 'Success',
      message: 'Cache repair job triggered successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Fix specific user cache
router.post('/repair/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await EmployeeModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }

    const bureauService = require('../services/bureauService');
    const score = bureauService.calculateBaseScore(user);
    const success = await cacheRepairService.cacheScoreWithRetry(userId, score);

    res.json({
      status: success ? 'Success' : 'Error',
      message: success ? 'User cache repaired successfully' : 'Failed to repair user cache',
      data: { userId, repairedScore: score }
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

module.exports = router;