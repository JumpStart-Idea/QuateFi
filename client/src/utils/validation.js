// Validation utility functions for the application

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateEmail = (email) => {
  if (!email) return "Email is required";
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  if (email.length > 254) return "Email is too long (maximum 254 characters)";
  if (email.length < 5) return "Email is too short";
  
  return "";
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 128) return "Password is too long (maximum 128 characters)";
  
  return "";
};

/**
 * Validates password with strength requirements
 * @param {string} password - Password to validate
 * @returns {object} - Object with isValid boolean and error message
 */
export const validatePasswordStrength = (password) => {
  if (!password) return { isValid: false, error: "Password is required" };
  if (password.length < 8) return { isValid: false, error: "Password must be at least 8 characters" };
  if (password.length > 128) return { isValid: false, error: "Password is too long (maximum 128 characters)" };
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const missingRequirements = [];
  if (!hasUpperCase) missingRequirements.push("uppercase letter");
  if (!hasLowerCase) missingRequirements.push("lowercase letter");
  if (!hasNumbers) missingRequirements.push("number");
  if (!hasSpecialChar) missingRequirements.push("special character");
  
  if (missingRequirements.length > 0) {
    return { 
      isValid: false, 
      error: `Password must contain at least one ${missingRequirements.join(", ")}` 
    };
  }
  
  return { isValid: true, error: "" };
};

/**
 * Validates name field
 * @param {string} name - Name to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name is too long (maximum 50 characters)";
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name can only contain letters, spaces, hyphens, and apostrophes";
  
  return "";
};

/**
 * Validates phone number
 * @param {string} phone - Phone number to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) return "Phone number must have at least 10 digits";
  if (digitsOnly.length > 15) return "Phone number is too long";
  
  return "";
};

/**
 * Validates required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string} - Error message or empty string if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return "";
};

/**
 * Validates minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum required length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string} - Error message or empty string if valid
 */
export const validateMinLength = (value, minLength, fieldName) => {
  if (!value) return "";
  if (value.length < minLength) return `${fieldName} must be at least ${minLength} characters`;
  return "";
};

/**
 * Validates maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string} - Error message or empty string if valid
 */
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (!value) return "";
  if (value.length > maxLength) return `${fieldName} is too long (maximum ${maxLength} characters)`;
  return "";
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateUrl = (url) => {
  if (!url) return "";
  
  try {
    new URL(url);
    return "";
  } catch {
    return "Please enter a valid URL";
  }
};

/**
 * Validates numeric value
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string} - Error message or empty string if valid
 */
export const validateNumeric = (value, fieldName) => {
  if (!value) return "";
  if (isNaN(value) || value === "") return `${fieldName} must be a number`;
  return "";
};

/**
 * Validates positive number
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string} - Error message or empty string if valid
 */
export const validatePositiveNumber = (value, fieldName) => {
  const numericError = validateNumeric(value, fieldName);
  if (numericError) return numericError;
  
  if (parseFloat(value) <= 0) return `${fieldName} must be a positive number`;
  return "";
};

/**
 * Validates form object with validation rules
 * @param {object} formData - Form data object
 * @param {object} validationRules - Object with field names as keys and validation functions as values
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName];
    const validationFunction = validationRules[fieldName];
    
    if (typeof validationFunction === 'function') {
      const error = validationFunction(value);
      if (error) {
        errors[fieldName] = error;
      }
    }
  });
  
  return errors;
};

/**
 * Checks if form is valid (no errors)
 * @param {object} errors - Errors object
 * @returns {boolean} - True if form is valid
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0 || Object.values(errors).every(error => !error);
}; 