const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const secureAuthRoutes = require('./secure-auth.routes');
const userRoutes = require('./user.routes');
const conversationRoutes = require('./conversation.routes');
const aiRoutes = require('./ai.routes');
const memoryRoutes = require('./memory.routes');
// const adminRoutes = require('./admin.routes');

// Health check endpoint
router.get('/health', async (req, res) => {
  const db = require('../config/database');
  const aiService = require('../services/ai');
  const dbHealth = await db.healthCheck();
  const aiProviders = aiService.getAvailableProviders();
  
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth,
      ai: aiProviders,
    },
  });
});

// API version info
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'HenMo AI API',
      version: '1.0.0',
      description: 'Enterprise AI Platform API',
      endpoints: {
        auth: '/api/v1/auth',
        'secure-auth': '/api/v1/secure-auth',
        users: '/api/v1/users',
        conversations: '/api/v1/conversations',
        ai: '/api/v1/ai',
        memory: '/api/v1/memory (coming soon)',
        // admin: '/api/v1/admin',
        streets: '/api/v1/streets (coming soon)',
        contributions: '/api/v1/contributions (coming soon)',
      },
    },
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/secure-auth', secureAuthRoutes);
router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);
router.use('/ai', aiRoutes);
router.use('/memory', memoryRoutes);
// router.use('/admin', adminRoutes);

module.exports = router;