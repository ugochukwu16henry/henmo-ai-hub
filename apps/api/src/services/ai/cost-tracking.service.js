class CostTrackingService {
  constructor() {
    this.modelPricing = {
      'gpt-4': {
        input: 0.03 / 1000,  // $0.03 per 1K tokens
        output: 0.06 / 1000  // $0.06 per 1K tokens
      },
      'gpt-3.5-turbo': {
        input: 0.0015 / 1000,  // $0.0015 per 1K tokens
        output: 0.002 / 1000   // $0.002 per 1K tokens
      },
      'text-embedding-ada-002': {
        input: 0.0001 / 1000,  // $0.0001 per 1K tokens
        output: 0
      },
      'dall-e-3': {
        '1024x1024': 0.040,    // $0.040 per image
        '1024x1792': 0.080,    // $0.080 per image
        '1792x1024': 0.080     // $0.080 per image
      }
    }
    
    this.userCosts = new Map() // In production, use database
  }

  calculateCost(model, inputTokens, outputTokens = 0, imageSize = null) {
    const pricing = this.modelPricing[model]
    if (!pricing) return 0

    if (model.includes('dall-e')) {
      return pricing[imageSize] || 0
    }

    return (inputTokens * pricing.input) + (outputTokens * pricing.output)
  }

  async trackUserCost(userId, model, inputTokens, outputTokens = 0, imageSize = null) {
    try {
      const cost = this.calculateCost(model, inputTokens, outputTokens, imageSize)
      
      if (!this.userCosts.has(userId)) {
        this.userCosts.set(userId, {
          totalCost: 0,
          dailyCost: 0,
          monthlyCost: 0,
          usage: [],
          lastReset: new Date()
        })
      }

      const userCostData = this.userCosts.get(userId)
      
      // Reset daily cost if new day
      const now = new Date()
      const lastReset = new Date(userCostData.lastReset)
      if (now.getDate() !== lastReset.getDate()) {
        userCostData.dailyCost = 0
        userCostData.lastReset = now
      }

      // Reset monthly cost if new month
      if (now.getMonth() !== lastReset.getMonth()) {
        userCostData.monthlyCost = 0
      }

      userCostData.totalCost += cost
      userCostData.dailyCost += cost
      userCostData.monthlyCost += cost
      
      userCostData.usage.push({
        timestamp: now.toISOString(),
        model,
        inputTokens,
        outputTokens,
        imageSize,
        cost
      })

      // Keep only last 100 usage records
      if (userCostData.usage.length > 100) {
        userCostData.usage = userCostData.usage.slice(-100)
      }

      this.userCosts.set(userId, userCostData)

      // Track in analytics
      const analyticsService = require('../analytics.service')
      analyticsService.trackEvent(userId, 'ai_cost', {
        model,
        cost,
        inputTokens,
        outputTokens,
        imageSize
      })

      return {
        success: true,
        cost,
        totalCost: userCostData.totalCost,
        dailyCost: userCostData.dailyCost,
        monthlyCost: userCostData.monthlyCost
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  getUserCostSummary(userId) {
    const userCostData = this.userCosts.get(userId)
    if (!userCostData) {
      return {
        totalCost: 0,
        dailyCost: 0,
        monthlyCost: 0,
        usage: []
      }
    }

    return {
      totalCost: userCostData.totalCost,
      dailyCost: userCostData.dailyCost,
      monthlyCost: userCostData.monthlyCost,
      usage: userCostData.usage.slice(-10), // Last 10 usage records
      breakdown: this.getCostBreakdown(userCostData.usage)
    }
  }

  getCostBreakdown(usage) {
    const breakdown = {}
    
    usage.forEach(record => {
      if (!breakdown[record.model]) {
        breakdown[record.model] = {
          totalCost: 0,
          totalTokens: 0,
          requests: 0
        }
      }
      
      breakdown[record.model].totalCost += record.cost
      breakdown[record.model].totalTokens += (record.inputTokens + record.outputTokens)
      breakdown[record.model].requests += 1
    })

    return breakdown
  }

  async checkUserLimit(userId, dailyLimit = 10, monthlyLimit = 100) {
    const costData = this.getUserCostSummary(userId)
    
    return {
      dailyLimitReached: costData.dailyCost >= dailyLimit,
      monthlyLimitReached: costData.monthlyCost >= monthlyLimit,
      dailyRemaining: Math.max(0, dailyLimit - costData.dailyCost),
      monthlyRemaining: Math.max(0, monthlyLimit - costData.monthlyCost),
      currentUsage: {
        daily: costData.dailyCost,
        monthly: costData.monthlyCost
      }
    }
  }

  async generateCostReport(userId, period = 'month') {
    try {
      const costData = this.getUserCostSummary(userId)
      const now = new Date()
      
      let filteredUsage = costData.usage
      if (period === 'day') {
        const today = now.toDateString()
        filteredUsage = costData.usage.filter(u => 
          new Date(u.timestamp).toDateString() === today
        )
      } else if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filteredUsage = costData.usage.filter(u => 
          new Date(u.timestamp) >= weekAgo
        )
      }

      const totalCost = filteredUsage.reduce((sum, u) => sum + u.cost, 0)
      const totalTokens = filteredUsage.reduce((sum, u) => sum + u.inputTokens + u.outputTokens, 0)
      
      return {
        success: true,
        report: {
          period,
          totalCost,
          totalTokens,
          requestCount: filteredUsage.length,
          breakdown: this.getCostBreakdown(filteredUsage),
          averageCostPerRequest: filteredUsage.length > 0 ? totalCost / filteredUsage.length : 0,
          mostUsedModel: this.getMostUsedModel(filteredUsage)
        }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  getMostUsedModel(usage) {
    const modelCounts = {}
    usage.forEach(u => {
      modelCounts[u.model] = (modelCounts[u.model] || 0) + 1
    })
    
    return Object.entries(modelCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
  }

  async estimateCost(model, inputText, outputLength = 500) {
    // Rough estimation: 1 token ≈ 4 characters
    const inputTokens = Math.ceil(inputText.length / 4)
    const outputTokens = Math.ceil(outputLength / 4)
    
    const estimatedCost = this.calculateCost(model, inputTokens, outputTokens)
    
    return {
      success: true,
      estimation: {
        inputTokens,
        outputTokens,
        estimatedCost,
        model
      }
    }
  }
}

module.exports = new CostTrackingService()