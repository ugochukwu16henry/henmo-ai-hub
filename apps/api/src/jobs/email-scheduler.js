let cron = null;
try {
  cron = require('node-cron');
} catch (error) {
  console.warn('node-cron not available - email scheduling disabled');
}

const emailService = require('../services/email.service')

class EmailScheduler {
  static init() {
    if (!cron) {
      console.warn('Email scheduler disabled - node-cron not available');
      return;
    }

    // Weekly digest - Every Sunday at 9 AM
    cron.schedule('0 9 * * 0', async () => {
      console.log('Sending weekly digests...')
      await this.sendWeeklyDigests()
    })

    // Monthly reports - First day of month at 10 AM
    cron.schedule('0 10 1 * *', async () => {
      console.log('Sending monthly reports...')
      await this.sendMonthlyReports()
    })

    // Daily cleanup - Every day at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Running email cleanup...')
      await this.cleanupOldEmails()
    })
  }

  static async sendWeeklyDigests() {
    try {
      // Get all active users
      const users = await this.getActiveUsers()
      
      for (const user of users) {
        const digestData = await this.generateWeeklyDigest(user.id)
        await emailService.sendWeeklyDigest(user.email, digestData)
      }
      
      console.log(`Weekly digests sent to ${users.length} users`)
    } catch (error) {
      console.error('Weekly digest error:', error)
    }
  }

  static async sendMonthlyReports() {
    try {
      const users = await this.getActiveUsers()
      
      for (const user of users) {
        const reportData = await this.generateMonthlyReport(user.id)
        await emailService.sendMonthlyReport(user.email, reportData)
      }
      
      console.log(`Monthly reports sent to ${users.length} users`)
    } catch (error) {
      console.error('Monthly report error:', error)
    }
  }

  static async getActiveUsers() {
    // Mock data - replace with actual database query
    return [
      { id: 1, email: 'user@example.com', name: 'John Doe' }
    ]
  }

  static async generateWeeklyDigest(userId) {
    // Mock data - replace with actual analytics
    return {
      conversations: [
        { title: 'React Components', preview: 'Discussed component architecture...' },
        { title: 'API Design', preview: 'Explored REST vs GraphQL...' }
      ],
      memories: [
        { title: 'TypeScript Tips' },
        { title: 'Performance Optimization' }
      ],
      achievements: ['First Plugin Created', 'Week Streak'],
      stats: {
        conversations: 15,
        memories: 8,
        totalTime: 240
      }
    }
  }

  static async generateMonthlyReport(userId) {
    return {
      conversations: 45,
      memories: 23,
      tokensUsed: 125000,
      topFeatures: [
        { name: 'AI Chat', usage: 89 },
        { name: 'Memory Browser', usage: 34 },
        { name: 'Code Analysis', usage: 21 }
      ]
    }
  }

  static async cleanupOldEmails() {
    // Cleanup logic for old email logs, bounced emails, etc.
    console.log('Email cleanup completed')
  }

  static async sendBulkNotification(title, message, userIds = null) {
    try {
      const users = userIds ? 
        await this.getUsersByIds(userIds) : 
        await this.getActiveUsers()
      
      const results = []
      
      for (const user of users) {
        const result = await emailService.sendNotificationEmail(
          user.email, 
          title, 
          message,
          `${process.env.FRONTEND_URL}/dashboard`
        )
        results.push({ email: user.email, success: result.success })
      }
      
      return results
    } catch (error) {
      console.error('Bulk notification error:', error)
      return []
    }
  }

  static async getUsersByIds(userIds) {
    // Mock implementation
    return userIds.map(id => ({ id, email: `user${id}@example.com` }))
  }
}

module.exports = EmailScheduler