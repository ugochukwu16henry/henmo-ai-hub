const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const axios = require('axios')
const crypto = require('crypto')

class PaymentService {
  constructor() {
    this.paystack = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })
  }

  // Stripe Integration
  async createStripeSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      })

      return {
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async createStripeCustomer(email, name) {
    try {
      const customer = await stripe.customers.create({ email, name })
      return { success: true, customerId: customer.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Paystack Integration (Nigeria)
  async createPaystackSubscription(email, planCode, amount) {
    try {
      const response = await this.paystack.post('/subscription', {
        customer: email,
        plan: planCode,
        amount: amount * 100 // Convert to kobo
      })

      return {
        success: true,
        subscriptionCode: response.data.data.subscription_code,
        emailToken: response.data.data.email_token
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  async initializePaystackPayment(email, amount, currency = 'NGN') {
    try {
      const response = await this.paystack.post('/transaction/initialize', {
        email,
        amount: amount * 100,
        currency,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`
      })

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  // Webhook Handlers
  async handleStripeWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object)
          break
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancelled(event.data.object)
          break
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async handlePaystackWebhook(payload, signature) {
    try {
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(payload))
        .digest('hex')

      if (hash !== signature) {
        throw new Error('Invalid signature')
      }

      const { event, data } = payload

      switch (event) {
        case 'charge.success':
          await this.handlePaymentSuccess(data)
          break
        case 'subscription.create':
          await this.handleSubscriptionCreated(data)
          break
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Invoice Generation
  async generateInvoice(customerId, items, dueDate) {
    try {
      const invoice = await stripe.invoices.create({
        customer: customerId,
        collection_method: 'send_invoice',
        days_until_due: Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      })

      for (const item of items) {
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: item.amount * 100,
          currency: 'usd',
          description: item.description
        })
      }

      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      await stripe.invoices.sendInvoice(invoice.id)

      return {
        success: true,
        invoiceId: finalizedInvoice.id,
        invoiceUrl: finalizedInvoice.hosted_invoice_url
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Contributor Payouts
  async createContributorPayout(contributorId, amount, currency = 'usd') {
    try {
      // Create Stripe Connect account for contributor if not exists
      const account = await this.getOrCreateConnectAccount(contributorId)
      
      const transfer = await stripe.transfers.create({
        amount: amount * 100,
        currency,
        destination: account.id,
        description: `Payout for contributor ${contributorId}`
      })

      return {
        success: true,
        transferId: transfer.id,
        amount: transfer.amount / 100
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getOrCreateConnectAccount(contributorId) {
    // Mock implementation - replace with actual database lookup
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: `contributor${contributorId}@henmo.ai`
      })
      return account
    } catch (error) {
      throw error
    }
  }

  async processPaystackPayout(recipientCode, amount, reason) {
    try {
      const response = await this.paystack.post('/transfer', {
        source: 'balance',
        amount: amount * 100,
        recipient: recipientCode,
        reason
      })

      return {
        success: true,
        transferCode: response.data.data.transfer_code,
        reference: response.data.data.reference
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  // Event Handlers
  async handlePaymentSuccess(paymentData) {
    console.log('Payment succeeded:', paymentData.id)
    // Update database, send confirmation email, etc.
  }

  async handleSubscriptionPayment(invoice) {
    console.log('Subscription payment:', invoice.id)
    // Update subscription status, send receipt, etc.
  }

  async handleSubscriptionCancelled(subscription) {
    console.log('Subscription cancelled:', subscription.id)
    // Update user access, send cancellation email, etc.
  }

  async handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.subscription_code)
    // Update database, send welcome email, etc.
  }

  // Subscription Management
  async cancelSubscription(subscriptionId, provider = 'stripe') {
    try {
      if (provider === 'stripe') {
        await stripe.subscriptions.cancel(subscriptionId)
      } else if (provider === 'paystack') {
        await this.paystack.post('/subscription/disable', {
          code: subscriptionId,
          token: process.env.PAYSTACK_SECRET_KEY
        })
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getSubscriptionStatus(subscriptionId, provider = 'stripe') {
    try {
      if (provider === 'stripe') {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        return { success: true, status: subscription.status }
      } else if (provider === 'paystack') {
        const response = await this.paystack.get(`/subscription/${subscriptionId}`)
        return { success: true, status: response.data.data.status }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new PaymentService()