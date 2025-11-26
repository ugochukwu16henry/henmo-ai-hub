const streamingService = require('../services/ai/streaming.service')
const embeddingsService = require('../services/ai/embeddings.service')
const summarizationService = require('../services/ai/summarization.service')
const multiLangService = require('../services/ai/multilang.service')
const personalitiesService = require('../services/ai/personalities.service')
const costTrackingService = require('../services/ai/cost-tracking.service')

class AIController {
  // Streaming responses
  static async streamChat(req, res) {
    try {
      const { messages } = req.body
      const userId = req.user.userId
      
      await streamingService.streamChatCompletion(messages, userId, res)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // RAG functionality
  static async ragQuery(req, res) {
    try {
      const { query, conversationId } = req.body
      const userId = req.user.userId
      
      const result = await embeddingsService.ragQuery(query, userId, conversationId)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async storeMemory(req, res) {
    try {
      const { title, content, tags } = req.body
      const userId = req.user.userId
      
      const result = await embeddingsService.storeUserMemory(userId, title, content, tags)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async searchMemories(req, res) {
    try {
      const { query, limit } = req.query
      const userId = req.user.userId
      
      const result = await embeddingsService.searchSimilar(query, parseInt(limit) || 5, {
        userId,
        type: 'memory'
      })
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Summarization
  static async summarizeConversation(req, res) {
    try {
      const { messages, maxLength } = req.body
      
      const result = await summarizationService.summarizeConversation(messages, maxLength)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async extractKeyPoints(req, res) {
    try {
      const { text, maxPoints } = req.body
      
      const result = await summarizationService.extractKeyPoints(text, maxPoints)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Multi-language support
  static async detectLanguage(req, res) {
    try {
      const { text } = req.body
      
      const result = await multiLangService.detectLanguage(text)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async translateText(req, res) {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body
      
      const result = await multiLangService.translateText(text, targetLanguage, sourceLanguage)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async chatInLanguage(req, res) {
    try {
      const { messages, language } = req.body
      
      const result = await multiLangService.chatInLanguage(messages, language)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getSupportedLanguages(req, res) {
    try {
      const languages = multiLangService.getSupportedLanguages()
      res.json({ success: true, languages })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Personalities
  static async chatWithPersonality(req, res) {
    try {
      const { messages, personalityId } = req.body
      const userId = req.user.userId
      
      const result = await personalitiesService.chatWithPersonality(messages, personalityId, userId)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static getPersonalities(req, res) {
    try {
      const personalities = personalitiesService.getPersonalities()
      res.json({ success: true, personalities })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async createCustomPersonality(req, res) {
    try {
      const { name, systemPrompt, temperature, traits } = req.body
      const userId = req.user.userId
      
      const result = await personalitiesService.createCustomPersonality(
        userId, name, systemPrompt, temperature, traits
      )
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  // Cost tracking
  static async getUserCosts(req, res) {
    try {
      const userId = req.user.userId
      
      const costSummary = costTrackingService.getUserCostSummary(userId)
      res.json({ success: true, costs: costSummary })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async checkUserLimits(req, res) {
    try {
      const userId = req.user.userId
      const { dailyLimit, monthlyLimit } = req.query
      
      const limits = await costTrackingService.checkUserLimit(
        userId, 
        parseFloat(dailyLimit) || 10, 
        parseFloat(monthlyLimit) || 100
      )
      res.json({ success: true, limits })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async generateCostReport(req, res) {
    try {
      const userId = req.user.userId
      const { period } = req.query
      
      const result = await costTrackingService.generateCostReport(userId, period)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async estimateCost(req, res) {
    try {
      const { model, inputText, outputLength } = req.body
      
      const result = await costTrackingService.estimateCost(model, inputText, outputLength)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

module.exports = AIController