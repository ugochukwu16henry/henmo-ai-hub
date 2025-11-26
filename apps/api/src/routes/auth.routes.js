const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} = require('../validators/auth.validator');

// Public routes (with rate limiting)
router.post('/register', AuthMiddleware.authRateLimit, authController.register);
router.post('/login', AuthMiddleware.authRateLimit, authController.login);
router.post('/refresh', AuthMiddleware.authRateLimit, authController.refresh);

// Protected routes (require authentication)
router.get('/me', AuthMiddleware.authenticate, authController.getMe);
router.post('/logout', AuthMiddleware.authenticate, authController.logout);

module.exports = router;