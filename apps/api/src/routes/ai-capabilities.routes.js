const express = require('express');
const AICapabilitiesController = require('../controllers/ai-capabilities.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const aiController = new AICapabilitiesController();

// Apply authentication to all routes
router.use(AuthMiddleware.authenticate);

// Code Analysis Routes
router.post('/analyze/code', aiController.analyzeCode.bind(aiController));
router.post('/analyze/directory', AuthMiddleware.authorize(['admin', 'super_admin']), aiController.scanDirectory.bind(aiController));

// File Operations Routes
router.get('/files/:filePath(*)', aiController.readFile.bind(aiController));
router.post('/files/write', aiController.writeFile.bind(aiController));
router.post('/files/create', aiController.createFile.bind(aiController));
router.delete('/files/:filePath(*)', aiController.deleteFile.bind(aiController));
router.get('/directories/:dirPath(*)', aiController.listDirectory.bind(aiController));
router.post('/files/search', aiController.searchFiles.bind(aiController));
router.post('/execute/command', AuthMiddleware.authorize(['admin', 'super_admin']), aiController.executeCommand.bind(aiController));

// Debugging Routes
router.post('/debug/error', aiController.analyzeError.bind(aiController));
router.post('/debug/code', aiController.debugCode.bind(aiController));

// Code Generation Routes
router.post('/generate/code', aiController.generateCode.bind(aiController));
router.post('/optimize/code', aiController.optimizeCode.bind(aiController));

// Capabilities Info
router.get('/capabilities', aiController.getCapabilities.bind(aiController));

module.exports = router;