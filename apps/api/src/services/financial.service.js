const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class FinancialService {
  // Company Wallet Management
  async getWalletBalances() {
    const result = await pool.query('SELECT * FROM company_wallet ORDER BY currency');
    return result.rows;
  }

  async updateWalletBalance(currency, amount, type = 'credit', description = '') {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get current balance
      const balanceResult = await client.query(
        'SELECT balance FROM company_wallet WHERE currency = $1',
        [currency]
      );
      
      const currentBalance = balanceResult.rows[0]?.balance || 0;
      const newBalance = type === 'credit' 
        ? parseFloat(currentBalance) + parseFloat(amount)
        : parseFloat(currentBalance) - parseFloat(amount);

      // Update wallet
      await client.query(
        'UPDATE company_wallet SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE currency = $2',
        [newBalance, currency]
      );

      // Log transaction
      await client.query(
        `INSERT INTO financial_transactions 
         (type, amount, currency, balance_before, balance_after, description) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [type, amount, currency, currentBalance, newBalance, description]
      );

      await client.query('COMMIT');
      return { success: true, newBalance };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Revenue Tracking
  async recordRevenue(data) {
    const { type, amount, currency, paymentProcessor, transactionId, userId, description } = data;
    
    const result = await pool.query(
      `INSERT INTO revenue_records 
       (type, amount, currency, payment_processor, transaction_id, user_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, amount, currency, paymentProcessor, transactionId, userId, description]
    );

    // Update wallet balance
    await this.updateWalletBalance(currency, amount, 'credit', `Revenue: ${type}`);
    
    return result.rows[0];
  }

  async getRevenueReport(startDate, endDate) {
    const result = await pool.query(
      `SELECT type, currency, SUM(amount) as total, COUNT(*) as count
       FROM revenue_records 
       WHERE created_at BETWEEN $1 AND $2 
       GROUP BY type, currency 
       ORDER BY total DESC`,
      [startDate, endDate]
    );
    return result.rows;
  }

  // Expense Management
  async recordExpense(data) {
    const { category, amount, currency, recipientType, recipientId, description } = data;
    
    const result = await pool.query(
      `INSERT INTO expense_records 
       (category, amount, currency, recipient_type, recipient_id, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [category, amount, currency, recipientType, recipientId, description]
    );

    // Update wallet balance
    await this.updateWalletBalance(currency, amount, 'debit', `Expense: ${category}`);
    
    return result.rows[0];
  }

  // Payroll Processing
  async processPayroll(employeeId, grossAmount, currency, taxRate = 0.1) {
    const taxWithheld = grossAmount * taxRate;
    const netAmount = grossAmount - taxWithheld;

    const result = await pool.query(
      `INSERT INTO payroll_records 
       (employee_id, gross_amount, tax_withheld, net_amount, currency, pay_period_start, pay_period_end) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [employeeId, grossAmount, taxWithheld, netAmount, currency, 
       new Date(Date.now() - 30*24*60*60*1000), new Date()]
    );

    // Record as expense
    await this.recordExpense({
      category: 'salaries',
      amount: netAmount,
      currency,
      recipientType: 'employee',
      recipientId: employeeId,
      description: `Salary payment for employee ${employeeId}`
    });

    return result.rows[0];
  }

  // Financial Reports
  async getProfitLossReport(startDate, endDate) {
    const revenue = await pool.query(
      `SELECT currency, SUM(amount) as total_revenue
       FROM revenue_records 
       WHERE created_at BETWEEN $1 AND $2 
       GROUP BY currency`,
      [startDate, endDate]
    );

    const expenses = await pool.query(
      `SELECT currency, SUM(amount) as total_expenses
       FROM expense_records 
       WHERE created_at BETWEEN $1 AND $2 
       GROUP BY currency`,
      [startDate, endDate]
    );

    return { revenue: revenue.rows, expenses: expenses.rows };
  }

  async getCashFlowReport(months = 12) {
    const result = await pool.query(
      `SELECT 
         DATE_TRUNC('month', created_at) as month,
         currency,
         SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END) as net_flow
       FROM financial_transactions 
       WHERE created_at >= NOW() - INTERVAL '${months} months'
       GROUP BY month, currency 
       ORDER BY month DESC`
    );
    return result.rows;
  }
}

module.exports = new FinancialService();