const express = require('express');
const {
  submitMaterial,
  approveMaterial,
  getPendingMaterials,
  getKnowledgeBase,
  getLearningStats,
  enhancedChat
} = require('../controllers/self-learning.controller');

const router = express.Router();

// Submit learning material
router.post('/submit-material', submitMaterial);

// Admin routes for material approval
router.post('/approve/:materialId', approveMaterial);
router.get('/pending-materials', getPendingMaterials);

// Knowledge base access
router.get('/knowledge-base', getKnowledgeBase);
router.get('/stats', getLearningStats);

// Enhanced AI responses
router.post('/enhanced-chat', enhancedChat);

module.exports = router;