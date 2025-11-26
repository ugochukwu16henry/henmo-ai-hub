const express = require('express');
const MediaController = require('../controllers/media.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const mediaController = new MediaController();

// Apply authentication to all routes
router.use(AuthMiddleware.authenticate);

// Video Generation Routes
router.post('/video/demo', mediaController.generateDemoVideo.bind(mediaController));
router.post('/video/showcase', mediaController.generateAppShowcase.bind(mediaController));
router.post('/video/version', mediaController.generateVersionDemo.bind(mediaController));

// Image Generation Routes
router.post('/image/generate', mediaController.generateImage.bind(mediaController));
router.post('/image/branding', mediaController.generateCompanyBranding.bind(mediaController));
router.post('/image/screenshot', mediaController.generateProductScreenshot.bind(mediaController));

// Media Management Routes
router.get('/list', mediaController.listGeneratedMedia.bind(mediaController));
router.get('/download/:type/:mediaId', mediaController.downloadMedia.bind(mediaController));
router.delete('/:type/:mediaId', AuthMiddleware.authorize(['admin', 'super_admin']), mediaController.deleteMedia.bind(mediaController));

// Batch Operations
router.post('/batch', AuthMiddleware.authorize(['admin', 'super_admin']), mediaController.generateBatch.bind(mediaController));

// Templates
router.get('/templates', mediaController.getTemplates.bind(mediaController));

module.exports = router;