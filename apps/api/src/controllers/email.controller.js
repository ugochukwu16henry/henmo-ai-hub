const emailService = require('../services/email.service')
const jwt = require('jsonwebtoken')

class EmailController {
  static async sendVerification(req, res) {
    try {
      const { email } = req.body
      const token = jwt.sign({ email, type: 'verification' }, process.env.JWT_SECRET, { expiresIn: '24h' })
      
      const result = await emailService.sendVerificationEmail(email, token)
      
      res.json({
        success: result.success,
        message: result.success ? 'Verification email sent' : 'Failed to send email'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async sendPasswordReset(req, res) {
    try {
      const { email } = req.body
      const token = jwt.sign({ email, type: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '1h' })
      
      const result = await emailService.sendPasswordResetEmail(email, token)
      
      res.json({
        success: result.success,
        message: result.success ? 'Password reset email sent' : 'Failed to send email'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async sendNotification(req, res) {
    try {
      const { email, title, message, actionUrl } = req.body
      
      const result = await emailService.sendNotificationEmail(email, title, message, actionUrl)
      
      res.json({
        success: result.success,
        message: result.success ? 'Notification sent' : 'Failed to send notification'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async sendWeeklyDigest(req, res) {
    try {
      const { email, data } = req.body
      
      const result = await emailService.sendWeeklyDigest(email, data)
      
      res.json({
        success: result.success,
        message: result.success ? 'Weekly digest sent' : 'Failed to send digest'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async sendInvoice(req, res) {
    try {
      const { email, invoice } = req.body
      
      const result = await emailService.sendInvoiceEmail(email, invoice)
      
      res.json({
        success: result.success,
        message: result.success ? 'Invoice sent' : 'Failed to send invoice'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  static async sendBulk(req, res) {
    try {
      const { emails, template, data } = req.body
      
      const results = await emailService.sendBulkEmails(emails, template, data)
      
      const successful = results.filter(r => r.success).length
      
      res.json({
        success: true,
        message: `${successful}/${results.length} emails sent successfully`,
        results
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = EmailController