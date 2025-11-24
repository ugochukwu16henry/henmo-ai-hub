const { body, param, query } = require('express-validator');

const createMemoryValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 50000 })
    .withMessage('Content must be less than 50000 characters'),
  
  body('contentType')
    .optional()
    .isIn(['note', 'code', 'document', 'snippet', 'idea'])
    .withMessage('Invalid content type'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  body('isPinned')
    .optional()
    .isBoolean()
    .withMessage('isPinned must be a boolean'),
];

const updateMemoryValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid memory ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  
  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 }),
  
  body('contentType')
    .optional()
    .isIn(['note', 'code', 'document', 'snippet', 'idea']),
  
  body('tags')
    .optional()
    .isArray(),
  
  body('isPinned')
    .optional()
    .isBoolean(),
];

const getMemoryValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid memory ID'),
];

const listMemoriesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('contentType')
    .optional()
    .isIn(['note', 'code', 'document', 'snippet', 'idea']),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  
  query('pinned')
    .optional()
    .isBoolean(),
];

const searchMemoriesValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  
  query('contentType')
    .optional()
    .isIn(['note', 'code', 'document', 'snippet', 'idea']),
];

module.exports = {
  createMemoryValidation,
  updateMemoryValidation,
  getMemoryValidation,
  listMemoriesValidation,
  searchMemoriesValidation,
};