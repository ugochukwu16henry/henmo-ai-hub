const express = require('express');
const { body } = require('express-validator');
// const validate = require('../middleware/validate');
// const { 
//   loginLimiter, 
//   checkAccountLockout, 
//   botDetection,
//   validateSession 
// } = require('../middleware/security');
const {
  secureLogin,
  secureLogout,
  getCurrentUser,
  changePassword
} = require('../controllers/secure-auth.controller');

const router = express.Router();

// Secure login
router.post('/login', secureLogin);

// Secure logout
router.post('/logout',
  secureLogout
);

// Get current user
router.get('/me',
  getCurrentUser
);

// Change password
router.put('/change-password', changePassword);

module.exports = router;