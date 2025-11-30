const express = require('express');
const { body, param, query } = require('express-validator');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { adminLimiter, checkAdminIP, validateSession } = require('../middleware/security');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

// Apply security middleware to all admin routes
router.use(adminLimiter);
router.use(checkAdminIP);

// Middleware to check admin permissions
const requireAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: { message: 'Admin access required' } });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: { message: 'Super admin access required' } });
  }
  next();
};

// Invitation routes
router.post('/invitations',
  validateSession,
  requireAdmin,
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['moderator', 'admin']),
  body('country').optional().isString().trim(),
  validate,
  adminController.sendInvitation
);

router.get('/invitations',
  validateSession,
  requireAdmin,
  adminController.getInvitations
);

router.delete('/invitations/:id',
  validateSession,
  requireAdmin,
  param('id').isUUID(),
  validate,
  adminController.cancelInvitation
);

// Public invitation acceptance (no auth required)
router.get('/verify-invitation/:token',
  param('token').isString().trim(),
  validate,
  adminController.verifyInvitation
);

router.post('/accept-invitation',
  body('token').isString().trim(),
  body('password').isLength({ min: 6 }),
  body('name').isString().trim(),
  validate,
  adminController.acceptInvitation
);

// User management routes
router.get('/users',
  validateSession,
  requireAdmin,
  query('country').optional().isString(),
  query('role').optional().isIn(['user', 'moderator', 'admin']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate,
  adminController.getUsers
);

router.put('/users/:id/role',
  validateSession,
  requireAdmin,
  param('id').isUUID(),
  body('role').isIn(['user', 'moderator', 'admin']),
  validate,
  adminController.updateUserRole
);

router.put('/users/:id/country',
  validateSession,
  requireSuperAdmin,
  param('id').isUUID(),
  body('country').isString().trim(),
  validate,
  adminController.updateUserCountry
);

router.delete('/users/:id',
  validateSession,
  requireAdmin,
  param('id').isUUID(),
  validate,
  adminController.deleteUser
);

// Admin dashboard stats
router.get('/stats',
  validateSession,
  requireAdmin,
  adminController.getAdminStats
);

module.exports = router;