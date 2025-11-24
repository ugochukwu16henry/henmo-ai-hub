const rateLimit = require('express-rate-limit');
const config = require('../config');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.userId || req.ip;
  },
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again in 15 minutes',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// AI endpoint limiter (based on subscription)
const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: (req) => {
    if (!req.user) return 10; // Unauthenticated
    
    const limits = config.subscriptionLimits[req.user.subscription_tier];
    if (!limits) return 50;
    
    return limits.messagesPerDay === -1 ? 10000 : limits.messagesPerDay;
  },
  message: {
    success: false,
    error: {
      message: 'Daily message limit reached. Upgrade your subscription for more.',
    },
  },
  keyGenerator: (req) => `ai:${req.userId || req.ip}`,
  skip: (req) => {
    // Skip for unlimited tiers
    if (!req.user) return false;
    const limits = config.subscriptionLimits[req.user.subscription_tier];
    return limits?.messagesPerDay === -1;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
};