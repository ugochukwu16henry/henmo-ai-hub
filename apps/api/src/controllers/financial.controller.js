const financialService = require('../services/financial.service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class FinancialController {
  // Dashboard Overview
  async getDashboard(req, res) {
    try {
      const walletBalances = await financialService.getWalletBalances();
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30*24*60*60*1000);
      
      const monthlyReport = await financialService.getProfitLossReport(startDate, endDate);
      const cashFlow = await financialService.getCashFlowReport(6);

      res.json({
        walletBalances,
        monthlyReport,
        cashFlow
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Wallet Management
  async getWallet(req, res) {
    try {
      const balances = await financialService.getWalletBalances();
      res.json(balances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Revenue Reports
  async getRevenueReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await financialService.getRevenueReport(
        startDate || new Date(Date.now() - 30*24*60*60*1000),
        endDate || new Date()
      );
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Process Subscription Payment
  async processSubscription(req, res) {
    try {
      const { userId, planId, paymentMethodId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2999, // $29.99
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: `${process.env.FRONTEND_URL}/dashboard`
      });

      if (paymentIntent.status === 'succeeded') {
        await financialService.recordRevenue({
          type: 'subscription',
          amount: 29.99,
          currency: 'USD',
          paymentProcessor: 'stripe',
          transactionId: paymentIntent.id,
          userId,
          description: `Subscription payment for plan ${planId}`
        });
      }

      res.json({ success: true, paymentIntent });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Process Contributor Payout
  async processContributorPayout(req, res) {
    try {
      const { contributorId, amount, currency } = req.body;
      
      // Create Stripe transfer (requires Express account)
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        destination: `acct_${contributorId}` // Contributor's Stripe account
      });

      await financialService.recordExpense({
        category: 'payouts',
        amount,
        currency,
        recipientType: 'contributor',
        recipientId: contributorId,
        description: `Payout to contributor ${contributorId}`
      });

      res.json({ success: true, transfer });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Financial Reports
  async getProfitLoss(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const report = await financialService.getProfitLossReport(
        startDate || new Date(Date.now() - 30*24*60*60*1000),
        endDate || new Date()
      );
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCashFlow(req, res) {
    try {
      const { months = 12 } = req.query;
      const report = await financialService.getCashFlowReport(months);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Payroll Processing
  async processPayroll(req, res) {
    try {
      const { employeeId, amount, currency } = req.body;
      const payroll = await financialService.processPayroll(employeeId, amount, currency);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FinancialController();