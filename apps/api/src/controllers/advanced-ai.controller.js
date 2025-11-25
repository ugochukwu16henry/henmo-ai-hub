const advancedAI = require('../services/advanced-ai.service');
const logger = require('../utils/logger');

// Code Analysis
const analyzeCode = async (req, res) => {
  try {
    const { code, language, task } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        error: { message: 'Code and language are required' }
      });
    }

    const analysis = await advancedAI.analyzeCode(code, language, task);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error('Code analysis error:', error);
    res.status(500).json({
      error: { message: 'Failed to analyze code' }
    });
  }
};

// Data Processing
const processData = async (req, res) => {
  try {
    const { data, analysisType } = req.body;
    
    if (!data) {
      return res.status(400).json({
        error: { message: 'Data is required' }
      });
    }

    const insights = await advancedAI.processData(data, analysisType);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    logger.error('Data processing error:', error);
    res.status(500).json({
      error: { message: 'Failed to process data' }
    });
  }
};

// Intelligent Chat
const intelligentChat = async (req, res) => {
  try {
    const { message, context, files } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: { message: 'Message is required' }
      });
    }

    const response = await advancedAI.intelligentChat(message, context, files);
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error('Intelligent chat error:', error);
    res.status(500).json({
      error: { message: 'Failed to process chat' }
    });
  }
};

// Code Generation
const generateCode = async (req, res) => {
  try {
    const { requirements, language, framework } = req.body;
    
    if (!requirements || !language) {
      return res.status(400).json({
        error: { message: 'Requirements and language are required' }
      });
    }

    const code = await advancedAI.generateCode(requirements, language, framework);
    
    res.json({
      success: true,
      data: code
    });
  } catch (error) {
    logger.error('Code generation error:', error);
    res.status(500).json({
      error: { message: 'Failed to generate code' }
    });
  }
};

// Debug Code
const debugCode = async (req, res) => {
  try {
    const { code, error, language } = req.body;
    
    if (!code || !error || !language) {
      return res.status(400).json({
        error: { message: 'Code, error, and language are required' }
      });
    }

    const debug = await advancedAI.debugCode(code, error, language);
    
    res.json({
      success: true,
      data: debug
    });
  } catch (error) {
    logger.error('Code debugging error:', error);
    res.status(500).json({
      error: { message: 'Failed to debug code' }
    });
  }
};

// Security Analysis
const securityAnalysis = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        error: { message: 'Code and language are required' }
      });
    }

    const security = await advancedAI.securityAnalysis(code, language);
    
    res.json({
      success: true,
      data: security
    });
  } catch (error) {
    logger.error('Security analysis error:', error);
    res.status(500).json({
      error: { message: 'Failed to analyze security' }
    });
  }
};

// Performance Optimization
const optimizePerformance = async (req, res) => {
  try {
    const { code, language, context } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        error: { message: 'Code and language are required' }
      });
    }

    const optimization = await advancedAI.optimizePerformance(code, language, context);
    
    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    logger.error('Performance optimization error:', error);
    res.status(500).json({
      error: { message: 'Failed to optimize performance' }
    });
  }
};

// Explain Code
const explainCode = async (req, res) => {
  try {
    const { code, language, level } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        error: { message: 'Code and language are required' }
      });
    }

    const explanation = await advancedAI.explainCode(code, language, level);
    
    res.json({
      success: true,
      data: explanation
    });
  } catch (error) {
    logger.error('Code explanation error:', error);
    res.status(500).json({
      error: { message: 'Failed to explain code' }
    });
  }
};

module.exports = {
  analyzeCode,
  processData,
  intelligentChat,
  generateCode,
  debugCode,
  securityAnalysis,
  optimizePerformance,
  explainCode
};