const db = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class UserService {
  // Get user by ID
  async getById(id) {
    const result = await db.query(
      `SELECT id, email, name, phone, role, status, subscription_tier,
              country, city, timezone, language, avatar_url,
              email_verified, phone_verified, reputation_score,
              total_contributions, total_verifications,
              last_login_at, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return result.rows[0];
  }

  // Update user profile
  async updateProfile(id, updates) {
    const allowedFields = ['name', 'phone', 'country', 'city', 'timezone', 'language', 'avatar_url'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No valid fields to update');
    }

    values.push(id);
    
    const result = await db.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, name, phone, role, status, subscription_tier,
                 country, city, timezone, language, avatar_url,
                 email_verified, phone_verified`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    logger.info('User profile updated', { userId: id });

    return result.rows[0];
  }

  // List users (admin)
  async list({ page = 1, limit = 20, role, status, country, search }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (role) {
      conditions.push(`role = $${paramIndex}`);
      values.push(role);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (country) {
      conditions.push(`country ILIKE $${paramIndex}`);
      values.push(`%${country}%`);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Get users
    values.push(limit, offset);
    const result = await db.query(
      `SELECT id, email, name, role, status, subscription_tier,
              country, city, reputation_score, total_contributions,
              last_login_at, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new UserService();