const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

class PaymentProcessors {
  // Stripe Integration (Global)
  async createStripePayment(amount, currency, customerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        customer: customerId,
        automatic_payment_methods: { enabled: true }
      });
      return { success: true, data: paymentIntent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createStripeSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
      return { success: true, data: subscription };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Paystack Integration (Nigeria)
  async createPaystackPayment(amount, currency, email) {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          amount: Math.round(amount * 100),
          currency,
          email,
          callback_url: `${process.env.FRONTEND_URL}/payment/callback`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async verifyPaystackPayment(reference) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  // Wise Business Integration (International Transfers)
  async createWiseTransfer(amount, currency, recipientId) {
    try {
      const response = await axios.post(
        'https://api.transferwise.com/v1/transfers',
        {
          targetAccount: recipientId,
          quote: await this.getWiseQuote(amount, currency),
          customerTransactionId: `henmo-${Date.now()}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WISE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async getWiseQuote(amount, currency) {
    try {
      const response = await axios.post(
        'https://api.transferwise.com/v1/quotes',
        {
          source: 'USD',
          target: currency,
          sourceAmount: amount,
          type: 'BALANCE_PAYOUT'
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WISE_API_TOKEN}`
          }
        }
      );
      return response.data.id;
    } catch (error) {
      throw error;
    }
  }

  // Currency Conversion
  async getExchangeRate(from, to) {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      return response.data.rates[to] || 1;
    } catch (error) {
      return 1; // Fallback to 1:1 rate
    }
  }

  // Webhook Handlers
  async handleStripeWebhook(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        return this.processSuccessfulPayment(event.data.object, 'stripe');
      case 'invoice.payment_succeeded':
        return this.processSubscriptionPayment(event.data.object, 'stripe');
      default:
        return { success: true, message: 'Unhandled event type' };
    }
  }

  async handlePaystackWebhook(event) {
    if (event.event === 'charge.success') {
      return this.processSuccessfulPayment(event.data, 'paystack');
    }
    return { success: true, message: 'Unhandled event type' };
  }

  async processSuccessfulPayment(paymentData, processor) {
    const financialService = require('./financial.service');
    
    const amount = processor === 'stripe' 
      ? paymentData.amount / 100 
      : paymentData.amount / 100;
    
    const currency = paymentData.currency.toUpperCase();
    
    await financialService.recordRevenue({
      type: 'subscription',
      amount,
      currency,
      paymentProcessor: processor,
      transactionId: paymentData.id,
      userId: paymentData.metadata?.userId,
      description: `Payment via ${processor}`
    });

    return { success: true };
  }
}

module.exports = new PaymentProcessors();