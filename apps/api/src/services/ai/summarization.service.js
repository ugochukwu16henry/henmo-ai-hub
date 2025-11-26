const { OpenAI } = require('openai')

class SummarizationService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async summarizeConversation(messages, maxLength = 200) {
    try {
      const conversationText = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Summarize the following conversation in ${maxLength} characters or less. Focus on key points, decisions, and outcomes.`
        }, {
          role: 'user',
          content: conversationText
        }],
        max_tokens: Math.ceil(maxLength / 4),
        temperature: 0.3
      })

      return {
        success: true,
        summary: response.choices[0].message.content,
        originalLength: conversationText.length,
        summaryLength: response.choices[0].message.content.length
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async summarizeContext(context, query, maxLength = 300) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Summarize the following context to be relevant for answering the query. Keep it under ${maxLength} characters.`
        }, {
          role: 'user',
          content: `Query: ${query}\n\nContext: ${context}`
        }],
        max_tokens: Math.ceil(maxLength / 4),
        temperature: 0.2
      })

      return {
        success: true,
        summary: response.choices[0].message.content
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async extractKeyPoints(text, maxPoints = 5) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Extract the ${maxPoints} most important key points from the following text. Return as a JSON array of strings.`
        }, {
          role: 'user',
          content: text
        }],
        temperature: 0.2
      })

      const keyPoints = JSON.parse(response.choices[0].message.content)
      
      return {
        success: true,
        keyPoints
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async generateTitle(content, maxLength = 50) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Generate a concise title (max ${maxLength} characters) for the following content.`
        }, {
          role: 'user',
          content: content.substring(0, 1000) // Limit input length
        }],
        max_tokens: 20,
        temperature: 0.3
      })

      return {
        success: true,
        title: response.choices[0].message.content.replace(/['"]/g, '')
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async compressContext(messages, targetLength = 2000) {
    try {
      if (messages.length <= 3) return { success: true, messages }

      const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0)
      
      if (totalLength <= targetLength) {
        return { success: true, messages }
      }

      // Keep first and last messages, summarize middle
      const firstMessage = messages[0]
      const lastMessage = messages[messages.length - 1]
      const middleMessages = messages.slice(1, -1)

      const summaryResult = await this.summarizeConversation(middleMessages, targetLength - firstMessage.content.length - lastMessage.content.length)

      if (!summaryResult.success) {
        throw new Error(summaryResult.error)
      }

      return {
        success: true,
        messages: [
          firstMessage,
          {
            role: 'system',
            content: `[Summary of previous conversation: ${summaryResult.summary}]`
          },
          lastMessage
        ]
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new SummarizationService()