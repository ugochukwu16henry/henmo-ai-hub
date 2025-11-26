const express = require('express');
const contentController = require('../controllers/content.controller');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public routes (for marketing website)
router.get('/public/:type', contentController.getContentByType);
router.get('/public/seo/:path', contentController.getSEOMetadata);

// Admin routes (protected)
router.get('/', authenticateToken, requireRole(['super_admin', 'admin']), contentController.getAllContent);
router.post('/', authenticateToken, requireRole(['super_admin', 'admin']), contentController.createContent);
router.put('/:id', authenticateToken, requireRole(['super_admin', 'admin']), contentController.updateContent);
router.delete('/:id', authenticateToken, requireRole(['super_admin', 'admin']), contentController.deleteContent);

// Blog management
router.get('/blog', contentController.getAllBlogPosts);
router.post('/blog', authenticateToken, requireRole(['super_admin', 'admin']), contentController.createBlogPost);

// SEO management
router.put('/seo/:path', authenticateToken, requireRole(['super_admin', 'admin']), contentController.updateSEOMetadata);

module.exports = router;