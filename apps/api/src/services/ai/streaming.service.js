const { OpenAI } = require('openai')

class StreamingService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async streamChatCompletion(messages, userId, res) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        stream: true,
        temperature: 0.7
      })

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      })

      let fullResponse = ''
      let tokenCount = 0

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullResponse += content
          tokenCount++
          
          res.write(`data: ${JSON.stringify({
            type: 'content',
            content,
            tokens: tokenCount
          })}\n\n`)
        }
      }

      // Track usage
      await this.trackUsage(userId, tokenCount, fullResponse.length)

      res.write(`data: ${JSON.stringify({
        type: 'done',
        totalTokens: tokenCount,
        cost: this.calculateCost(tokenCount)
      })}\n\n`)

      res.end()
    } catch (error) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        error: error.message
      })}\n\n`)
      res.end()
    }
  }

  async streamWebSocket(ws, messages, userId) {
    try {
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        stream: true
      })

      let fullResponse = ''
      let tokenCount = 0

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullResponse += content
          tokenCount++
          
          ws.send(JSON.stringify({
            type: 'stream',
            content,
            tokens: tokenCount
          }))
        }
      }

      await this.trackUsage(userId, tokenCount, fullResponse.length)

      ws.send(JSON.stringify({
        type: 'complete',
        totalTokens: tokenCount,
        cost: this.calculateCost(tokenCount)
      }))
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }))
    }
  }

  calculateCost(tokens) {
    const costPerToken = 0.00003 // GPT-4 pricing
    return tokens * costPerToken
  }

  async trackUsage(userId, tokens, characters) {
    // Track in analytics service
    const analyticsService = require('../analytics.service')
    analyticsService.trackEvent(userId, 'ai_usage', {
      tokens,
      characters,
      cost: this.calculateCost(tokens),
      model: 'gpt-4'
    })
  }
}

module.exports = new StreamingService()