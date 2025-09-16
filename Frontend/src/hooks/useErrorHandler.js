import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import { handleAPIError, retryRequest } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleError = useCallback((error, showToast = true) => {
    const errorInfo = handleAPIError(error);
    setError(errorInfo);

    if (showToast) {
      toast.error('Error', errorInfo.message);
    }

    // Handle redirects
    if (errorInfo.redirect) {
      setTimeout(() => {
        window.location.href = errorInfo.redirect;
      }, 2000);
    }

    return errorInfo;
  }, [toast]);

  const executeWithErrorHandling = useCallback(async (
    asyncFunction, 
    options = {}
  ) => {
    const {
      showLoading = true,
      showToast = true,
      retries = 0,
      onSuccess,
      onError
    } = options;

    try {
      if (showLoading) setIsLoading(true);
      setError(null);

      let result;
      if (retries > 0) {
        result = await retryRequest(asyncFunction, retries);
      } else {
        result = await asyncFunction();
      }

      if (onSuccess) onSuccess(result);
      return result;

    } catch (error) {
      const errorInfo = handleError(error, showToast);
      if (onError) onError(errorInfo);
      throw error;
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    handleError,
    executeWithErrorHandling,
    clearError
  };
};

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${rule.label || name} is required`;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return `${rule.label || name} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${rule.label || name} format is invalid`;
    }

    if (value && rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `${rule.label || name} must be a valid email`;
    }

    return '';
  }, [validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [values, validationRules, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.values(errors).every(error => !error)
  };
};