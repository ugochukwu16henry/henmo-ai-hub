const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Secure login with account lockout
const secureLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        error: { message: 'Username and password required' } 
      });
    }
    
    // Get user with current attempt count
    const userResult = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0) {
      logger.warn(`Login attempt with invalid username: ${username} from IP: ${clientIP}`);
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' } 
      });
    }
    
    const user = userResult.rows[0];
    
    // Check if account is locked
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      logger.warn(`Login attempt on locked account: ${username} from IP: ${clientIP}`);
      return res.status(423).json({ 
        error: { message: 'Account locked due to multiple failed attempts' } 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      // Increment failed attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      let lockUntil = null;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (newFailedAttempts >= 5) {
        lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        logger.warn(`Account locked for user: ${username} after ${newFailedAttempts} failed attempts`);
      }
      
      await query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [newFailedAttempts, lockUntil, user.id]
      );
      
      logger.warn(`Failed login attempt ${newFailedAttempts} for user: ${username} from IP: ${clientIP}`);
      
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' } 
      });
    }
    
    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Update user with successful login
    await query(
      `UPDATE users SET 
        failed_login_attempts = 0, 
        locked_until = NULL, 
        last_login = NOW(), 
        login_ip = $1,
        session_token = $2
       WHERE id = $3`,
      [clientIP, sessionToken, user.id]
    );
    
    logger.info(`Successful login for user: ${username} from IP: ${clientIP}`);
    
    // Return user data without sensitive info
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      assigned_country: user.assigned_country
    };
    
    res.json({
      success: true,
      data: {
        user: userData,
        token: sessionToken,
        message: 'Login successful'
      }
    });
    
  } catch (error) {
    logger.error('Secure login error:', error);
    res.status(500).json({ error: { message: 'Login failed' } });
  }
};

// Secure logout
const secureLogout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Invalidate session token
      await query(
        'UPDATE users SET session_token = NULL WHERE session_token = $1',
        [token]
      );
    }
    
    res.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
    
  } catch (error) {
    logger.error('Secure logout error:', error);
    res.status(500).json({ error: { message: 'Logout failed' } });
  }
};

// Get current user (with session validation)
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Set by validateSession middleware
    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      assigned_country: user.assigned_country,
      last_login: user.last_login
    };
    
    res.json({
      success: true,
      data: { user: userData }
    });
    
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({ error: { message: 'Failed to get user data' } });
  }
};

// Change password (requires current password)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: { message: 'Current and new password required' } 
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: { message: 'New password must be at least 8 characters' } 
      });
    }
    
    // Verify current password
    const userResult = await query('SELECT password FROM users WHERE id = $1', [userId]);
    const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: { message: 'Current password is incorrect' } 
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password and invalidate all sessions
    await query(
      'UPDATE users SET password = $1, session_token = NULL WHERE id = $2',
      [hashedPassword, userId]
    );
    
    logger.info(`Password changed for user ID: ${userId}`);
    
    res.json({
      success: true,
      data: { message: 'Password changed successfully. Please login again.' }
    });
    
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: { message: 'Failed to change password' } });
  }
};

module.exports = {
  secureLogin,
  secureLogout,
  getCurrentUser,
  changePassword
};