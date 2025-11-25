const express = require('express');
const {
  analyzeCode,
  processData,
  intelligentChat,
  generateCode,
  debugCode,
  securityAnalysis,
  optimizePerformance,
  explainCode
} = require('../controllers/advanced-ai.controller');

const router = express.Router();

// Code Analysis & Review
router.post('/analyze-code', analyzeCode);
router.post('/debug-code', debugCode);
router.post('/security-analysis', securityAnalysis);
router.post('/optimize-performance', optimizePerformance);
router.post('/explain-code', explainCode);

// Code Generation
router.post('/generate-code', generateCode);

// Data Processing
router.post('/process-data', processData);

// Intelligent Chat (Enhanced)
router.post('/intelligent-chat', intelligentChat);

module.exports = router;