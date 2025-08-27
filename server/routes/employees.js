const express = require('express');
const router = express.Router();
const EmployeeModel = require('../models/Employee');

// Check if user exists by PAN and Aadhaar
router.post('/check-user', async (req, res) => {
  try {
    const { panNumber, aadhaarNumber } = req.body;
    
    const user = await EmployeeModel.findOne({
      panNumber: panNumber,
      aadhaarNumber: aadhaarNumber
    });
    
    if (user) {
      res.json({
        status: 'Success',
        data: user.toObject(),
        message: 'User found'
      });
    } else {
      res.status(404).json({
        status: 'Error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

module.exports = router;