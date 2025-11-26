const express = require('express');
const financialController = require('../controllers/financial.controller');
const paymentProcessors = require('../services/payment-processors');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Financial Dashboard (Admin only)
router.get('/dashboard', authenticateToken, requireRole(['super_admin', 'admin']), financialController.getDashboard);

// Wallet Management
router.get('/wallet', authenticateToken, requireRole(['super_admin', 'admin']), financialController.getWallet);

// Revenue Reports
router.get('/revenue', authenticateToken, requireRole(['super_admin', 'admin']), financialController.getRevenueReport);

// Expense Reports
router.get('/expenses', authenticateToken, requireRole(['super_admin', 'admin']), financialController.getProfitLoss);

// Cash Flow Reports
router.get('/cashflow', authenticateToken, requireRole(['super_admin', 'admin']), financialController.getCashFlow);

// Payment Processing
router.post('/payment/stripe', authenticateToken, financialController.processSubscription);
router.post('/payout/contributor', authenticateToken, requireRole(['super_admin', 'admin']), financialController.processContributorPayout);

// Payroll Processing
router.post('/payroll', authenticateToken, requireRole(['super_admin']), financialController.processPayroll);

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