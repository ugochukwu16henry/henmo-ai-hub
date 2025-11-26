const { OpenAI } = require('openai')

class PersonalitiesService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.personalities = {
      'professional': {
        name: 'Professional Assistant',
        systemPrompt: 'You are a professional AI assistant. Be formal, precise, and business-oriented in your responses. Focus on efficiency and accuracy.',
        temperature: 0.3,
        traits: ['formal', 'precise', 'efficient']
      },
      'friendly': {
        name: 'Friendly Helper',
        systemPrompt: 'You are a friendly and approachable AI assistant. Be warm, encouraging, and use casual language. Show empathy and understanding.',
        temperature: 0.7,
        traits: ['warm', 'encouraging', 'casual']
      },
      'creative': {
        name: 'Creative Genius',
        systemPrompt: 'You are a creative AI assistant. Think outside the box, suggest innovative solutions, and embrace artistic thinking. Be imaginative and inspiring.',
        temperature: 0.9,
        traits: ['innovative', 'artistic', 'inspiring']
      },
      'technical': {
        name: 'Technical Expert',
        systemPrompt: 'You are a technical AI assistant specializing in programming and technology. Be precise, use technical terminology, and provide detailed explanations.',
        temperature: 0.2,
        traits: ['technical', 'detailed', 'precise']
      },
      'mentor': {
        name: 'Wise Mentor',
        systemPrompt: 'You are a wise mentor AI. Guide users with patience, ask thoughtful questions, and help them discover answers themselves. Be supportive and insightful.',
        temperature: 0.5,
        traits: ['patient', 'insightful', 'supportive']
      },
      'analyst': {
        name: 'Data Analyst',
        systemPrompt: 'You are an analytical AI assistant. Focus on data, statistics, and logical reasoning. Provide evidence-based responses and structured analysis.',
        temperature: 0.1,
        traits: ['analytical', 'logical', 'evidence-based']
      }
    }
  }

  getPersonalities() {
    return Object.entries(this.personalities).map(([id, personality]) => ({
      id,
      name: personality.name,
      traits: personality.traits
    }))
  }

  getPersonality(personalityId) {
    return this.personalities[personalityId] || this.personalities['professional']
  }

  async chatWithPersonality(messages, personalityId = 'professional', userId) {
    try {
      const personality = this.getPersonality(personalityId)
      
      const systemMessage = {
        role: 'system',
        content: personality.systemPrompt
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [systemMessage, ...messages],
        temperature: personality.temperature,
        max_tokens: 2000
      })

      // Track personality usage
      await this.trackPersonalityUsage(userId, personalityId)

      return {
        success: true,
        response: response.choices[0].message.content,
        personality: {
          id: personalityId,
          name: personality.name
        },
        tokens: response.usage.total_tokens
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async createCustomPersonality(userId, name, systemPrompt, temperature = 0.7, traits = []) {
    try {
      const personalityId = `custom_${userId}_${Date.now()}`
      
      // Store in database (mock implementation)
      const customPersonality = {
        id: personalityId,
        userId,
        name,
        systemPrompt,
        temperature,
        traits,
        created: new Date().toISOString(),
        isCustom: true
      }

      // In real implementation, save to database
      console.log('Custom personality created:', customPersonality)

      return {
        success: true,
        personality: customPersonality
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getPersonalityRecommendation(userPreferences, conversationHistory) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Based on user preferences and conversation history, recommend the most suitable AI personality from: professional, friendly, creative, technical, mentor, analyst. Respond with just the personality ID.'
        }, {
          role: 'user',
          content: `User preferences: ${JSON.stringify(userPreferences)}\nRecent conversations: ${conversationHistory.slice(-3).map(c => c.summary).join('; ')}`
        }],
        max_tokens: 10,
        temperature: 0.3
      })

      const recommendedId = response.choices[0].message.content.trim().toLowerCase()
      const personality = this.getPersonality(recommendedId)

      return {
        success: true,
        recommendedPersonality: {
          id: recommendedId,
          name: personality.name,
          traits: personality.traits
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async adaptPersonalityToContext(personalityId, context, userFeedback) {
    try {
      const basePersonality = this.getPersonality(personalityId)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Adapt the following AI personality based on context and user feedback. Return an improved system prompt.`
        }, {
          role: 'user',
          content: `Base personality: ${basePersonality.systemPrompt}\nContext: ${context}\nUser feedback: ${userFeedback}`
        }],
        temperature: 0.4
      })

      return {
        success: true,
        adaptedPrompt: response.choices[0].message.content,
        originalPersonality: personalityId
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async trackPersonalityUsage(userId, personalityId) {
    const analyticsService = require('../analytics.service')
    analyticsService.trackEvent(userId, 'personality_used', {
      personalityId,
      timestamp: new Date().toISOString()
    })
  }

  async getPersonalityStats(userId) {
    const analyticsService = require('../analytics.service')
    // Mock implementation - in real app, query analytics
    return {
      success: true,
      stats: {
        mostUsed: 'professional',
        totalSessions: 45,
        personalityBreakdown: {
          professional: 20,
          friendly: 15,
          technical: 10
        }
      }
    }
  }
}

module.exports = new PersonalitiesService()