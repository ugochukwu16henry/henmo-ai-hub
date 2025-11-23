const { validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

// Validation middleware - runs after express-validator checks
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const details = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    throw ApiError.badRequest('Validation failed', details);
  }
  
  next();
};

module.exports = { validate };