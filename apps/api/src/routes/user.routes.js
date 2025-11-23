const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  updateProfileValidation,
  getUserValidation,
  listUsersValidation,
} = require('../validators/user.validator');

// All routes require authentication
router.use(authenticate);

// Current user routes
router.get('/me', userController.getProfile);
router.put('/me', updateProfileValidation, validate, userController.updateProfile);

// Admin routes
router.get(
  '/',
  requireRole('admin', 'super_admin'),
  listUsersValidation,
  validate,
  userController.listUsers
);

router.get(
  '/:id',
  requireRole('admin', 'super_admin'),
  getUserValidation,
  validate,
  userController.getUserById
);

module.exports = router;