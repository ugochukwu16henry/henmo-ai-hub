const { body, param, query } = require('express-validator');

const createConversationValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  
  body('mode')
    .optional()
    .isIn(['general', 'developer', 'learning', 'business'])
    .withMessage('Invalid conversation mode'),
  
  body('provider')
    .optional()
    .isIn(['anthropic', 'openai'])
    .withMessage('Invalid AI provider'),
  
  body('model')
    .optional()
    .trim()
    .isLength({ max: 100 }),
];

const sendMessageValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid conversation ID'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Message must be between 1 and 10000 characters'),
  
  body('provider')
    .optional()
    .isIn(['anthropic', 'openai'])
    .withMessage('Invalid AI provider'),
  
  body('model')
    .optional()
    .trim(),
];

const getConversationValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid conversation ID'),
];

const updateConversationValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid conversation ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }),
  
  body('mode')
    .optional()
    .isIn(['general', 'developer', 'learning', 'business']),
  
  body('is_archived')
    .optional()
    .isBoolean(),
];

const listConversationsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('mode')
    .optional()
    .isIn(['general', 'developer', 'learning', 'business']),
  
  query('archived')
    .optional()
    .isBoolean(),
];

module.exports = {
  createConversationValidation,
  sendMessageValidation,
  getConversationValidation,
  updateConversationValidation,
  listConversationsValidation,
};