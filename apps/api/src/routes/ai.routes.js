const express = require('express');
const router = express.Router();
const aiService = require('../services/ai');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const config = require('../config');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/ai/providers
const getProviders = asyncHandler(async (req, res) => {
  const available = aiService.getAvailableProviders();

  res.json({
    success: true,
    data: {
      default: config.ai.defaultProvider,
      providers: {
        anthropic: {
          available: available.anthropic,
          models: config.ai.anthropic.models,
        },
        openai: {
          available: available.openai,
          models: config.ai.openai.models,
        },
      },
    },
  });
});

router.get('/providers', getProviders);

// GET /api/v1/ai/models
const getModels = asyncHandler(async (req, res) => {
  const { provider } = req.query;

  if (!provider) {
    return res.json({
      success: true,
      data: {
        anthropic: config.ai.anthropic.models,
        openai: config.ai.openai.models,
      },
    });
  }

  const models = config.ai[provider]?.models;
  if (!models) {
    return res.status(404).json({
      success: false,
      error: { message: 'Provider not found' },
    });
  }

  res.json({
    success: true,
    data: models,
  });
});

router.get('/models', getModels);

module.exports = router;