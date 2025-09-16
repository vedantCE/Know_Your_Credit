const validator = require('validator');

// Input validation and sanitization
const validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName, panNumber, aadhaarNumber } = req.body;
  const errors = [];

  try {
    // Email validation
    if (!email || !validator.isEmail(email)) {
      errors.push('Valid email is required');
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Name validation
    if (!firstName || firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // PAN validation
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      errors.push('Invalid PAN format');
    }

    // Aadhaar validation
    if (aadhaarNumber && !/^[0-9]{12}$/.test(aadhaarNumber)) {
      errors.push('Invalid Aadhaar format');
    }

    // Sanitize inputs
    req.body.email = validator.normalizeEmail(email || '');
    req.body.firstName = validator.escape(firstName || '').trim();
    req.body.lastName = validator.escape(lastName || '').trim();

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Validation error occurred'
    });
  }
};

// Login validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  try {
    if (!email || !validator.isEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Validation failed',
        errors
      });
    }

    req.body.email = validator.normalizeEmail(email);
    next();
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Validation error occurred'
    });
  }
};

// Loan application validation
const validateLoanApplication = (req, res, next) => {
  const { requestedAmount, loanType, monthlyIncome } = req.body;
  const errors = [];

  try {
    if (!requestedAmount || isNaN(requestedAmount) || requestedAmount <= 0) {
      errors.push('Valid loan amount is required');
    }

    if (!loanType || !['Personal', 'Home', 'Car', 'Business'].includes(loanType)) {
      errors.push('Valid loan type is required');
    }

    if (!monthlyIncome || isNaN(monthlyIncome) || monthlyIncome <= 0) {
      errors.push('Valid monthly income is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'Error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Validation error occurred'
    });
  }
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateLoanApplication
};