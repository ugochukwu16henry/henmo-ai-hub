const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} = require('../validators/auth.validator');

// Public routes (with rate limiting)
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validate,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

router.post(
  '/refresh',
  authLimiter,
  refreshTokenValidation,
  validate,
  authController.refresh
);

router.post(
  '/forgot-password',
  authLimiter,
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

// Protected routes (require authentication)
router.get('/me', authenticate, authController.getMe);

router.post('/logout', authenticate, authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  authController.changePassword
);

module.exports = router;