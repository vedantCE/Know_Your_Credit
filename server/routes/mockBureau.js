const express = require('express');
const router = express.Router();
const mockBureauAPIs = require('../services/mockBureauAPIs');

// Get consolidated credit scores from all bureaus
router.post('/consolidated-score', async (req, res) => {
  try {
    const { panNumber, personalDetails } = req.body;
    
    if (!panNumber) {
      return res.status(400).json({
        status: 'Error',
        message: 'PAN number is required'
      });
    }
    
    const result = await mockBureauAPIs.getAllBureauScores(panNumber, personalDetails);
    
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

// Get individual bureau score
router.post('/score/:bureau', async (req, res) => {
  try {
    const { bureau } = req.params;
    const { panNumber, personalDetails } = req.body;
    
    if (!panNumber) {
      return res.status(400).json({
        status: 'Error',
        message: 'PAN number is required'
      });
    }
    
    let result;
    switch (bureau.toUpperCase()) {
      case 'CIBIL':
        result = await mockBureauAPIs.getCIBILScore(panNumber, personalDetails);
        break;
      case 'EXPERIAN':
        result = await mockBureauAPIs.getExperianScore(panNumber, personalDetails);
        break;
      case 'EQUIFAX':
        result = await mockBureauAPIs.getEquifaxScore(panNumber, personalDetails);
        break;
      case 'CRIF':
        result = await mockBureauAPIs.getCRIFScore(panNumber, personalDetails);
        break;
      default:
        return res.status(400).json({
          status: 'Error',
          message: 'Invalid bureau name'
        });
    }
    
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

// Get bureau health status
router.get('/health-status', (req, res) => {
  try {
    const healthStatus = mockBureauAPIs.getHealthStatus();
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Manual bureau status control (for testing)
router.post('/set-status', (req, res) => {
  try {
    const { bureau, status } = req.body;
    
    if (!bureau || !status) {
      return res.status(400).json({
        status: 'Error',
        message: 'Bureau and status are required'
      });
    }
    
    const validStatuses = ['UP', 'DOWN', 'SLOW'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Status must be UP, DOWN, or SLOW'
      });
    }
    
    const success = mockBureauAPIs.setBureauStatus(bureau.toUpperCase(), status);
    
    if (success) {
      res.json({
        status: 'Success',
        message: `${bureau} status set to ${status}`
      });
    } else {
      res.status(400).json({
        status: 'Error',
        message: 'Invalid bureau name'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Refresh bureau score (force new API call)
router.post('/refresh-score', async (req, res) => {
  try {
    const { panNumber, personalDetails } = req.body;
    
    if (!panNumber) {
      return res.status(400).json({
        status: 'Error',
        message: 'PAN number is required'
      });
    }
    
    // Force fresh API calls
    const result = await mockBureauAPIs.getAllBureauScores(panNumber, personalDetails);
    
    res.json({
      status: 'Success',
      message: 'Scores refreshed successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

module.exports = router;