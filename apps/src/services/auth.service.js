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
  async login({ email, password, deviceInfo, ipAddress }) {
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

    // Create session record
    await db.query(
      `INSERT INTO user_sessions (user_id, token_hash, device_info, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, tokenHash, JSON.stringify(deviceInfo || {}), ipAddress, expiresAt]
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

    // Optionally revoke all sessions
    // await db.query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);

    logger.info('User logged out', { userId });
  }

  // Logout all devices
  async logoutAll(userId) {
    await db.query(
      'UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1',
      [userId]
    );
    await db.query(
      'DELETE FROM user_sessions WHERE user_id = $1',
      [userId]
    );

    logger.info('User logged out from all devices', { userId });
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, userId]
    );

    // Revoke all refresh tokens (force re-login)
    await this.logoutAll(userId);

    logger.info('User changed password', { userId });
  }

  // Request password reset
  async forgotPassword(email) {
    const result = await db.query(
      'SELECT id, name FROM users WHERE email = $1',
      [email]
    );

    // Don't reveal if email exists
    if (result.rows.length === 0) {
      return;
    }

    const { id: userId } = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate existing reset tokens
    await db.query(
      'UPDATE password_resets SET used = TRUE WHERE user_id = $1',
      [userId]
    );

    // Create new reset token
    await db.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );

    // TODO: Send email with resetToken
    logger.info('Password reset requested', { userId });

    return resetToken; // In production, send via email instead
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await db.query(
      `SELECT user_id FROM password_resets 
       WHERE token_hash = $1 AND used = FALSE AND expires_at > NOW()`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    const { user_id } = result.rows[0];

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, user_id]
    );

    // Mark token as used
    await db.query(
      'UPDATE password_resets SET used = TRUE WHERE token_hash = $1',
      [tokenHash]
    );

    // Revoke all sessions
    await this.logoutAll(user_id);

    logger.info('Password reset completed', { userId: user_id });
  }
}

module.exports = new AuthService();