const nodemailer = require('nodemailer')

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    
    return await this.sendEmail({
      to: email,
      subject: 'Verify Your HenMo AI Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to HenMo AI!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
          <p>Or copy this link: ${verifyUrl}</p>
          <p>This link expires in 24 hours.</p>
        </div>
      `
    })
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    
    return await this.sendEmail({
      to: email,
      subject: 'Reset Your HenMo AI Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background: #FF3B30; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
          <p>Or copy this link: ${resetUrl}</p>
          <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `
    })
  }

  async sendNotificationEmail(email, title, message, actionUrl = null) {
    const actionButton = actionUrl ? 
      `<a href="${actionUrl}" style="background: #34C759; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
        View Details
      </a>` : ''

    return await this.sendEmail({
      to: email,
      subject: `HenMo AI: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${title}</h2>
          <p>${message}</p>
          ${actionButton}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            You received this because you're subscribed to HenMo AI notifications.
          </p>
        </div>
      `
    })
  }

  async sendWeeklyDigest(email, data) {
    const { conversations, memories, achievements, stats } = data
    
    return await this.sendEmail({
      to: email,
      subject: 'Your Weekly HenMo AI Digest',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Weekly Digest</h2>
          
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3>This Week's Stats</h3>
            <p>💬 ${stats.conversations} conversations</p>
            <p>🧠 ${stats.memories} memories saved</p>
            <p>⏱️ ${stats.totalTime} minutes active</p>
          </div>

          <div style="margin: 24px 0;">
            <h3>Recent Conversations</h3>
            ${conversations.map(conv => `
              <div style="border-left: 3px solid #007AFF; padding-left: 12px; margin: 8px 0;">
                <strong>${conv.title}</strong>
                <p style="color: #666; font-size: 14px;">${conv.preview}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin: 24px 0;">
            <h3>New Memories</h3>
            ${memories.map(memory => `
              <div style="background: #fff3cd; padding: 8px 12px; border-radius: 4px; margin: 4px 0;">
                <strong>${memory.title}</strong>
              </div>
            `).join('')}
          </div>

          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Dashboard
          </a>
        </div>
      `
    })
  }

  async sendInvoiceEmail(email, invoice) {
    return await this.sendEmail({
      to: email,
      subject: `Invoice #${invoice.number} - HenMo AI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice #${invoice.number}</h2>
          
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Amount:</strong> $${invoice.amount}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Plan:</strong> ${invoice.plan}</p>
          </div>

          <div style="margin: 24px 0;">
            <h3>Items</h3>
            ${invoice.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span>${item.description}</span>
                <span>$${item.amount}</span>
              </div>
            `).join('')}
          </div>

          <a href="${process.env.FRONTEND_URL}/billing/invoice/${invoice.id}" style="background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Invoice
          </a>
        </div>
      `
    })
  }

  async sendEmail({ to, subject, html, text = null }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"HenMo AI" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '')
      })

      console.log('Email sent:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Email error:', error)
      return { success: false, error: error.message }
    }
  }

  async sendBulkEmails(emails, template, data) {
    const results = []
    
    for (const email of emails) {
      try {
        const result = await this[template](email, data)
        results.push({ email, success: result.success })
      } catch (error) {
        results.push({ email, success: false, error: error.message })
      }
    }
    
    return results
  }
}

module.exports = new EmailService()