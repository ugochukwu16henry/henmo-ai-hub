const paymentService = require('../services/payment.service')
const emailService = require('../services/email.service')

class PaymentController {
  static async createSubscription(req, res) {
    try {
      const { provider, email, planId, amount } = req.body
      let result

      if (provider === 'stripe') {
        const customer = await paymentService.createStripeCustomer(email, req.user.name)
        if (!customer.success) throw new Error(customer.error)
        
        result = await paymentService.createStripeSubscription(customer.customerId, planId)
      } else if (provider === 'paystack') {
        result = await paymentService.createPaystackSubscription(email, planId, amount)
      }

      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async initializePayment(req, res) {
    try {
      const { provider, email, amount, currency } = req.body

      if (provider === 'paystack') {
        const result = await paymentService.initializePaystackPayment(email, amount, currency)
        res.json(result)
      } else {
        res.status(400).json({ success: false, error: 'Provider not supported for initialization' })
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async handleStripeWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature']
      const result = await paymentService.handleStripeWebhook(req.body, signature)
      
      res.json(result)
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  static async handlePaystackWebhook(req, res) {
    try {
      const signature = req.headers['x-paystack-signature']
      const result = await paymentService.handlePaystackWebhook(req.body, signature)
      
      res.json(result)
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }

  static async generateInvoice(req, res) {
    try {
      const { customerId, items, dueDate } = req.body
      const result = await paymentService.generateInvoice(customerId, items, dueDate)
      
      if (result.success) {
        // Send invoice email
        await emailService.sendInvoiceEmail(req.user.email, {
          id: result.invoiceId,
          url: result.invoiceUrl,
          items,
          dueDate
        })
      }

      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async processContributorPayout(req, res) {
    try {
      const { contributorId, amount, currency, provider } = req.body
      let result

      if (provider === 'stripe') {
        result = await paymentService.createContributorPayout(contributorId, amount, currency)
      } else if (provider === 'paystack') {
        result = await paymentService.processPaystackPayout(contributorId, amount, 'Contributor payout')
      }

      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async cancelSubscription(req, res) {
    try {
      const { subscriptionId, provider } = req.body
      const result = await paymentService.cancelSubscription(subscriptionId, provider)
      
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async getSubscriptionStatus(req, res) {
    try {
      const { subscriptionId } = req.params
      const { provider } = req.query
      
      const result = await paymentService.getSubscriptionStatus(subscriptionId, provider)
      res.json(result)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}

module.exports = PaymentController