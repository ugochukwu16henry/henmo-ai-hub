const express = require('express');
const financialController = require('../controllers/financial.controller');
const paymentProcessors = require('../services/payment-processors');
const { authenticate, requireRole } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Financial Dashboard (Admin only)
router.get('/dashboard', authenticate, requireRole('super_admin', 'admin'), financialController.getDashboard);

// Wallet Management
router.get('/wallet', authenticate, requireRole('super_admin', 'admin'), financialController.getWallet);

// Revenue Reports
router.get('/revenue', authenticate, requireRole('super_admin', 'admin'), financialController.getRevenueReport);

// Expense Reports
router.get('/expenses', authenticate, requireRole('super_admin', 'admin'), financialController.getProfitLoss);

// Cash Flow Reports
router.get('/cashflow', authenticate, requireRole('super_admin', 'admin'), financialController.getCashFlow);

// Payment Processing
router.post('/payment/stripe', authenticate, financialController.processSubscription);
router.post('/payout/contributor', authenticate, requireRole('super_admin', 'admin'), financialController.processContributorPayout);

// Payroll Processing
router.post('/payroll', authenticate, requireRole('super_admin'), financialController.processPayroll);

// Webhook Endpoints
router.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    await paymentProcessors.handleStripeWebhook(event);
    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

router.post('/webhook/paystack', async (req, res) => {
  try {
    await paymentProcessors.handlePaystackWebhook(req.body);
    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;