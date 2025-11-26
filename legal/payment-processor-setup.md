# Payment Processor Setup Guide

## 1. Stripe Setup (Global Payments)

### Account Registration
1. Visit https://stripe.com and create business account
2. Provide business information:
   - Legal business name: HenMo AI LLC
   - Business type: Technology/Software
   - Industry: Artificial Intelligence
   - Website: henmo-ai.com
3. Complete identity verification
4. Add bank account for payouts

### Required Documents
- Business registration certificate
- Tax identification number (EIN)
- Bank account verification
- Identity documents for beneficial owners

### Integration Steps
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Test webhook endpoints
stripe listen --forward-to localhost:3001/api/financial/webhook/stripe
```

### Environment Variables
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 2. Paystack Setup (Nigeria)

### Account Registration
1. Visit https://paystack.com and create business account
2. Provide business information:
   - Business name: HenMo AI Nigeria Ltd
   - Business type: Technology
   - RC Number: [CAC Registration Number]
3. Complete KYC verification
4. Add Nigerian bank account

### Required Documents
- Certificate of Incorporation (CAC)
- Tax Identification Number (TIN)
- Bank account statement
- Valid ID of directors
- Utility bill (proof of address)

### Integration Steps
```bash
# Test Paystack integration
curl -H "Authorization: Bearer sk_test_..." \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","amount":"20000"}' \
     -X POST https://api.paystack.co/transaction/initialize
```

### Environment Variables
```
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
```

## 3. Wise Business Setup (International)

### Account Registration
1. Visit https://wise.com/business and create account
2. Provide business information and verification
3. Complete multi-currency account setup
4. Verify business ownership

### Required Documents
- Business registration documents
- Proof of business address
- Identity verification for account holders
- Bank statements

### API Access
1. Apply for API access in Wise Business dashboard
2. Complete additional verification for API usage
3. Set up webhook endpoints for transaction notifications

### Environment Variables
```
WISE_API_TOKEN=...
WISE_PROFILE_ID=...
```

## 4. Legal Compliance Checklist

### US Compliance
- [ ] Business registered in Delaware
- [ ] Federal EIN obtained
- [ ] State business licenses (if required)
- [ ] Money transmitter licenses (state-specific)
- [ ] PCI DSS compliance assessment
- [ ] Privacy policy updated for payment data

### Nigerian Compliance
- [ ] CAC business registration
- [ ] Tax identification number (TIN)
- [ ] CBN approval for payment processing
- [ ] Data protection compliance (NDPR)
- [ ] Consumer protection compliance

### International Compliance
- [ ] GDPR compliance for EU customers
- [ ] AML/KYC procedures implemented
- [ ] Sanctions screening procedures
- [ ] Cross-border payment regulations

## 5. Testing & Go-Live

### Test Environment Setup
1. Use test API keys for all processors
2. Test payment flows for each currency
3. Verify webhook handling
4. Test refund and chargeback processes

### Production Deployment
1. Switch to live API keys
2. Configure production webhooks
3. Set up monitoring and alerting
4. Implement fraud detection rules

### Monitoring Setup
- Transaction success rates
- Payment processor fees
- Currency conversion costs
- Chargeback rates
- Customer payment preferences

## 6. Ongoing Maintenance

### Monthly Tasks
- [ ] Reconcile payment processor statements
- [ ] Review transaction fees and rates
- [ ] Update compliance documentation
- [ ] Monitor regulatory changes

### Quarterly Tasks
- [ ] Review payment processor performance
- [ ] Assess new payment methods
- [ ] Update risk management procedures
- [ ] Conduct compliance audits

### Annual Tasks
- [ ] Renew business licenses
- [ ] Update payment processor agreements
- [ ] Review and update policies
- [ ] Conduct security assessments

## Contact Information

### Stripe Support
- Email: support@stripe.com
- Phone: +1 (888) 926-2289
- Documentation: https://stripe.com/docs

### Paystack Support
- Email: support@paystack.com
- Phone: +234 (0) 1 888 3888
- Documentation: https://paystack.com/docs

### Wise Business Support
- Email: business@wise.com
- Phone: Available in app
- Documentation: https://api-docs.wise.com