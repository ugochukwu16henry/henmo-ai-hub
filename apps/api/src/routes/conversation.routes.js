const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  createConversationValidation,
  sendMessageValidation,
  getConversationValidation,
  updateConversationValidation,
  listConversationsValidation,
} = require('../validators/conversation.validator');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/conversations/stats
router.get('/stats', conversationController.getStats);

// GET /api/v1/conversations
router.get(
  '/',
  listConversationsValidation,
  validate,
  conversationController.list
);

// POST /api/v1/conversations
router.post(
  '/',
  createConversationValidation,
  validate,
  conversationController.create
);

// GET /api/v1/conversations/:id
router.get(
  '/:id',
  getConversationValidation,
  validate,
  conversationController.getById
);

// PUT /api/v1/conversations/:id
router.put(
  '/:id',
  updateConversationValidation,
  validate,
  conversationController.update
);

// DELETE /api/v1/conversations/:id
router.delete(
  '/:id',
  getConversationValidation,
  validate,
  conversationController.deleteConversation
);

// POST /api/v1/conversations/:id/messages (with AI rate limiting)
router.post(
  '/:id/messages',
  aiLimiter,
  sendMessageValidation,
  validate,
  conversationController.sendMessage
);

module.exports = router;