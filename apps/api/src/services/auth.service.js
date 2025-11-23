const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/database');
const { generateTokens, verifyRefreshToken } = require('../middleware/auth');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class AuthService {
  // Register new user
  async register({ email, password, name, country, city }) {
    // Check if email already exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      throw ApiError.conflict('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, country, city, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, email, name, role, status, subscription_tier, country, city, created_at`,
      [email, passwordHash, name, country, city]
    );

    const user = result.rows[0];

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Store refresh token hash
    const tokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    logger.info('New user registered', { userId: user.id, email: user.email });

    return {
      user,
      ...tokens,
    };
  }

  // Login user
  async login({ email, password, ipAddress }) {
    // Find user
    const result = await db.query(
      `SELECT id, email, password_hash, name, role, status, 
              subscription_tier, country, city, avatar_url, email_verified
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const user = result.rows[0];

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check status
    if (user.status !== 'active') {
      throw ApiError.forbidden(`Account is ${user.status}`);
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Store refresh token
    const tokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    // Update last login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Remove password from response
    delete user.password_hash;

    logger.info('User logged in', { userId: user.id });

    return {
      user,
      ...tokens,
    };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    // Verify token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in database
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    const result = await db.query(
      `SELECT rt.*, u.status as user_status
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.revoked = FALSE AND rt.expires_at > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const { user_id, user_status } = result.rows[0];

    if (user_status !== 'active') {
      throw ApiError.forbidden('Account is not active');
    }

    // Generate new tokens
    const tokens = generateTokens(user_id);

    // Revoke old refresh token
    await db.query(
      'UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1',
      [tokenHash]
    );

    // Store new refresh token
    const newTokenHash = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user_id, newTokenHash, expiresAt]
    );

    return tokens;
  }

  // Logout (revoke tokens)
  async logout(userId, refreshToken) {
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await db.query(
        'UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1',
        [tokenHash]
      );
    }

    logger.info('User logged out', { userId });
  }
}

module.exports = new AuthService();