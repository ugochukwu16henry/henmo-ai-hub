class AnalyticsService {
  constructor() {
    this.events = []
    this.userSessions = new Map()
  }

  trackEvent(userId, event, properties = {}) {
    const eventData = {
      id: Date.now().toString(),
      userId,
      event,
      properties,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(userId)
    }

    this.events.push(eventData)
    
    // Keep only last 10000 events in memory
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000)
    }

    return eventData
  }

  getSessionId(userId) {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, Date.now().toString())
    }
    return this.userSessions.get(userId)
  }

  getUserStats(userId, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const userEvents = this.events.filter(e => 
      e.userId === userId && new Date(e.timestamp) > since
    )

    const stats = {
      totalEvents: userEvents.length,
      conversations: userEvents.filter(e => e.event === 'conversation_started').length,
      memories: userEvents.filter(e => e.event === 'memory_saved').length,
      tokensUsed: userEvents
        .filter(e => e.event === 'tokens_used')
        .reduce((sum, e) => sum + (e.properties.tokens || 0), 0),
      activeTime: userEvents
        .filter(e => e.event === 'session_time')
        .reduce((sum, e) => sum + (e.properties.duration || 0), 0),
      topFeatures: this.getTopFeatures(userEvents)
    }

    return stats
  }

  getTopFeatures(events) {
    const features = {}
    events.forEach(e => {
      if (e.properties.feature) {
        features[e.properties.feature] = (features[e.properties.feature] || 0) + 1
      }
    })

    return Object.entries(features)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, usage]) => ({ name, usage }))
  }

  getSystemStats() {
    const totalUsers = new Set(this.events.map(e => e.userId)).size
    const totalEvents = this.events.length
    const last24h = this.events.filter(e => 
      new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length

    return {
      totalUsers,
      totalEvents,
      eventsLast24h: last24h,
      avgEventsPerUser: totalUsers > 0 ? Math.round(totalEvents / totalUsers) : 0
    }
  }

  getConversationTrends(days = 7) {
    const trends = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayEvents = this.events.filter(e => {
        const eventDate = new Date(e.timestamp)
        return eventDate >= dayStart && eventDate <= dayEnd && e.event === 'conversation_started'
      })

      trends.push({
        date: dayStart.toISOString().split('T')[0],
        conversations: dayEvents.length,
        uniqueUsers: new Set(dayEvents.map(e => e.userId)).size
      })
    }

    return trends
  }
}

module.exports = new AnalyticsService()