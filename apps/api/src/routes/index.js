const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

// Health check endpoint
router.get('/health', async (req, res) => {
  const db = require('../config/database');
  const dbHealth = await db.healthCheck();
  
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth,
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
        users: '/api/v1/users',
        conversations: '/api/v1/conversations (coming soon)',
        ai: '/api/v1/ai (coming soon)',
        streets: '/api/v1/streets (coming soon)',
        contributions: '/api/v1/contributions (coming soon)',
      },
    },
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;