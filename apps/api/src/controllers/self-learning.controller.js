const selfLearning = require('../services/self-learning.service');
const logger = require('../utils/logger');

// Submit learning material
const submitMaterial = async (req, res) => {
  try {
    const { title, content, materialType, source } = req.body;
    const userId = req.user?.id;

    if (!title || !content || !materialType) {
      return res.status(400).json({
        error: { message: 'Title, content, and material type are required' }
      });
    }

    const material = await selfLearning.submitLearningMaterial(
      title, content, materialType, source, userId
    );

    res.json({
      success: true,
      data: { material, message: 'Material submitted for approval' }
    });
  } catch (error) {
    logger.error('Submit material error:', error);
    res.status(500).json({
      error: { message: 'Failed to submit material' }
    });
  }
};

// Approve learning material (Admin only)
const approveMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user?.id;

    if (!['admin', 'super_admin'].includes(req.user?.role)) {
      return res.status(403).json({
        error: { message: 'Admin access required' }
      });
    }

    const material = await selfLearning.approveLearningMaterial(materialId, userId);

    if (!material) {
      return res.status(404).json({
        error: { message: 'Material not found' }
      });
    }

    res.json({
      success: true,
      data: { material, message: 'Material approved and processed' }
    });
  } catch (error) {
    logger.error('Approve material error:', error);
    res.status(500).json({
      error: { message: 'Failed to approve material' }
    });
  }
};

// Get pending materials (Admin only)
const getPendingMaterials = async (req, res) => {
  try {
    if (!['admin', 'super_admin'].includes(req.user?.role)) {
      return res.status(403).json({
        error: { message: 'Admin access required' }
      });
    }

    const materials = await selfLearning.getPendingMaterials();

    res.json({
      success: true,
      data: { materials }
    });
  } catch (error) {
    logger.error('Get pending materials error:', error);
    res.status(500).json({
      error: { message: 'Failed to get pending materials' }
    });
  }
};

// Get knowledge base
const getKnowledgeBase = async (req, res) => {
  try {
    const { topic } = req.query;
    const knowledge = await selfLearning.getKnowledgeBase(topic);

    res.json({
      success: true,
      data: { knowledge }
    });
  } catch (error) {
    logger.error('Get knowledge base error:', error);
    res.status(500).json({
      error: { message: 'Failed to get knowledge base' }
    });
  }
};

// Get learning statistics
const getLearningStats = async (req, res) => {
  try {
    const stats = await selfLearning.getLearningStats();

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    logger.error('Get learning stats error:', error);
    res.status(500).json({
      error: { message: 'Failed to get learning stats' }
    });
  }
};

// Enhanced AI chat with learned knowledge
const enhancedChat = async (req, res) => {
  try {
    const { message, baseResponse } = req.body;

    if (!message) {
      return res.status(400).json({
        error: { message: 'Message is required' }
      });
    }

    const enhancedResponse = await selfLearning.enhanceAIResponse(
      message, 
      baseResponse || 'I can help you with that.'
    );

    res.json({
      success: true,
      data: { 
        originalMessage: message,
        enhancedResponse,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Enhanced chat error:', error);
    res.status(500).json({
      error: { message: 'Failed to enhance response' }
    });
  }
};

module.exports = {
  submitMaterial,
  approveMaterial,
  getPendingMaterials,
  getKnowledgeBase,
  getLearningStats,
  enhancedChat
};