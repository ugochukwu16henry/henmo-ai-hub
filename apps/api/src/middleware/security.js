const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: { message: 'Too many login attempts, try again later' } },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Login rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: { message: 'Too many login attempts, try again later' } });
  }
});

// Rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { error: { message: 'Too many admin requests' } }
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
});

// IP whitelist for admin access
const adminIPWhitelist = [
  '127.0.0.1',
  '::1',
  // Add your trusted IPs here
];

const checkAdminIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  // Skip IP check in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  if (!adminIPWhitelist.includes(clientIP)) {
    logger.warn(`Admin access denied for IP: ${clientIP}`);
    return res.status(403).json({ error: { message: 'Access denied from this location' } });
  }
  
  next();
};

// Account lockout check
const checkAccountLockout = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return next();
    }
    
    const result = await query(
      'SELECT failed_login_attempts, locked_until FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Check if account is locked
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        logger.warn(`Login attempt on locked account: ${username || email}`);
        return res.status(423).json({ 
          error: { message: 'Account temporarily locked due to multiple failed attempts' } 
        });
      }
      
      // Reset lock if time has passed
      if (user.locked_until && new Date() >= new Date(user.locked_until)) {
        await query(
          'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE username = $1 OR email = $2',
          [username, email]
        );
      }
    }
    
    next();
  } catch (error) {
    logger.error('Account lockout check error:', error);
    next();
  }
};

// Bot detection middleware
const botDetection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const suspiciousPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i,
    /automated/i, /script/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    logger.warn(`Suspicious user agent detected: ${userAgent} from IP: ${req.ip}`);
    return res.status(403).json({ error: { message: 'Access denied' } });
  }
  
  next();
};

// Session validation
const validateSession = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }
    
    const result = await query(
      'SELECT * FROM users WHERE session_token = $1 AND session_token IS NOT NULL',
      [token]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: { message: 'Invalid session' } });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    logger.error('Session validation error:', error);
    res.status(500).json({ error: { message: 'Session validation failed' } });
  }
};

module.exports = {
  loginLimiter,
  adminLimiter,
  securityHeaders,
  checkAdminIP,
  checkAccountLockout,
  botDetection,
  validateSession
};