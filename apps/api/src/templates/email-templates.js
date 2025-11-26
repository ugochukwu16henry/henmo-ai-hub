class EmailTemplates {
  static getBaseTemplate(content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HenMo AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #007AFF, #5856D6); color: white; padding: 24px; text-align: center; }
          .content { padding: 24px; }
          .button { background: #007AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0; }
          .footer { background: #f8f9fa; padding: 16px 24px; text-align: center; color: #666; font-size: 12px; }
          .stats { background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HenMo AI</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>© 2024 HenMo AI. All rights reserved.</p>
            <p>You received this email because you have an account with HenMo AI.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  static welcome(name) {
    const content = `
      <h2>Welcome to HenMo AI, ${name}!</h2>
      <p>Your AI-powered development assistant is ready to help you build amazing things.</p>
      <div class="stats">
        <h3>What you can do:</h3>
        <p>💬 Chat with advanced AI models</p>
        <p>🧠 Save and organize your knowledge</p>
        <p>🔧 Use powerful development tools</p>
        <p>📊 Track your progress and analytics</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
    `
    return this.getBaseTemplate(content)
  }

  static paymentSuccess(amount, plan) {
    const content = `
      <h2>Payment Successful!</h2>
      <p>Thank you for upgrading to ${plan}. Your payment of $${amount} has been processed.</p>
      <div class="stats">
        <h3>Your new benefits:</h3>
        <p>✅ Unlimited AI conversations</p>
        <p>✅ Priority support</p>
        <p>✅ Advanced analytics</p>
        <p>✅ Custom integrations</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/billing" class="button">View Billing</a>
    `
    return this.getBaseTemplate(content)
  }

  static systemAlert(title, message, severity = 'info') {
    const colors = {
      info: '#007AFF',
      warning: '#FF9500',
      error: '#FF3B30',
      success: '#34C759'
    }
    
    const content = `
      <h2 style="color: ${colors[severity]}">${title}</h2>
      <p>${message}</p>
      <div class="stats">
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Severity:</strong> ${severity.toUpperCase()}</p>
      </div>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Check Dashboard</a>
    `
    return this.getBaseTemplate(content)
  }

  static monthlyReport(data) {
    const { conversations, memories, tokensUsed, topFeatures } = data
    
    const content = `
      <h2>Your Monthly Report</h2>
      <p>Here's what you accomplished this month with HenMo AI:</p>
      
      <div class="stats">
        <h3>Usage Statistics</h3>
        <div class="item"><span>Conversations</span><span>${conversations}</span></div>
        <div class="item"><span>Memories Saved</span><span>${memories}</span></div>
        <div class="item"><span>Tokens Used</span><span>${tokensUsed.toLocaleString()}</span></div>
      </div>

      <div class="stats">
        <h3>Most Used Features</h3>
        ${topFeatures.map(feature => `
          <div class="item">
            <span>${feature.name}</span>
            <span>${feature.usage} times</span>
          </div>
        `).join('')}
      </div>

      <a href="${process.env.FRONTEND_URL}/analytics" class="button">View Full Analytics</a>
    `
    return this.getBaseTemplate(content)
  }
}

module.exports = EmailTemplates