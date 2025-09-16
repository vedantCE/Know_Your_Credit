// Frontend error handling utilities

export class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

export const handleAPIError = (error) => {
  console.error('API Error:', error);

  // Network errors
  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      retry: true
    };
  }

  // HTTP errors
  const { status, data } = error.response;

  switch (status) {
    case 400:
      return {
        message: data.message || 'Invalid request. Please check your input.',
        type: 'validation',
        retry: false
      };
    case 401:
      return {
        message: 'Session expired. Please login again.',
        type: 'auth',
        retry: false,
        redirect: '/signin'
      };
    case 403:
      return {
        message: 'Access denied. You don\'t have permission.',
        type: 'permission',
        retry: false
      };
    case 404:
      return {
        message: 'Resource not found.',
        type: 'notfound',
        retry: false
      };
    case 429:
      return {
        message: 'Too many requests. Please wait and try again.',
        type: 'ratelimit',
        retry: true,
        retryAfter: 60000 // 1 minute
      };
    case 500:
      return {
        message: 'Server error. Please try again later.',
        type: 'server',
        retry: true
      };
    case 503:
      return {
        message: 'Service temporarily unavailable. Please try again later.',
        type: 'service',
        retry: true,
        retryAfter: 30000 // 30 seconds
      };
    default:
      return {
        message: data.message || 'An unexpected error occurred.',
        type: 'unknown',
        retry: true
      };
  }
};

export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const errorInfo = handleAPIError(error);
      
      if (!errorInfo.retry || i === maxRetries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];

    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      return;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be less than ${rule.maxLength} characters`;
      return;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${rule.label || field} format is invalid`;
      return;
    }

    if (value && rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = `${rule.label || field} must be a valid email`;
      return;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};