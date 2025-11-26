const analyticsService = require('../services/analytics.service')

class AnalyticsController {
  static trackEvent(req, res) {
    try {
      const { event, properties } = req.body
      const userId = req.user?.userId || 'anonymous'
      
      const eventData = analyticsService.trackEvent(userId, event, properties)
      
      res.json({
        success: true,
        eventId: eventData.id
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static getUserStats(req, res) {
    try {
      const userId = req.user.userId
      const days = parseInt(req.query.days) || 30
      
      const stats = analyticsService.getUserStats(userId, days)
      
      res.json({
        success: true,
        stats
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static getSystemStats(req, res) {
    try {
      const stats = analyticsService.getSystemStats()
      
      res.json({
        success: true,
        stats
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static getConversationTrends(req, res) {
    try {
      const days = parseInt(req.query.days) || 7
      const trends = analyticsService.getConversationTrends(days)
      
      res.json({
        success: true,
        trends
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = AnalyticsController