const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { 
  loginLimiter, 
  checkAccountLockout, 
  botDetection,
  validateSession 
} = require('../middleware/security');
const {
  secureLogin,
  secureLogout,
  getCurrentUser,
  changePassword
} = require('../controllers/secure-auth.controller');

const router = express.Router();

// Secure login with rate limiting and bot detection
router.post('/login',
  botDetection,
  loginLimiter,
  checkAccountLockout,
  [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('password').isLength({ min: 6 })
  ],
  validate,
  secureLogin
);

// Secure logout
router.post('/logout',
  validateSession,
  secureLogout
);

// Get current user
router.get('/me',
  validateSession,
  getCurrentUser
);

// Change password
router.put('/change-password',
  validateSession,
  [
    body('currentPassword').isLength({ min: 6 }),
    body('newPassword').isLength({ min: 8 })
  ],
  validate,
  changePassword
);

module.exports = router;