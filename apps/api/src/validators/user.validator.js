const { body, param, query } = require('express-validator');

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s-]{10,20}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  
  body('timezone')
    .optional()
    .trim()
    .isLength({ max: 50 }),
  
  body('language')
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 }),
];

const getUserValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID'),
];

const listUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['user', 'contributor', 'verifier', 'developer', 'admin', 'super_admin'])
    .withMessage('Invalid role'),
  
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'pending_verification'])
    .withMessage('Invalid status'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }),
];

module.exports = {
  updateProfileValidation,
  getUserValidation,
  listUsersValidation,
};