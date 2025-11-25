const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Send invitation
const sendInvitation = async (req, res) => {
  try {
    const { email, role, country } = req.body;
    const invitedBy = req.user.id;

    // Permission checks
    if (role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        error: { message: 'Only super admins can invite country admins' } 
      });
    }

    if (role === 'moderator' && req.user.role === 'admin' && country !== req.user.assigned_country) {
      return res.status(403).json({ 
        error: { message: 'You can only invite moderators for your assigned country' } 
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: { message: 'User with this email already exists' } 
      });
    }

    // Check for existing pending invitation
    const existingInvitation = await query(
      'SELECT id FROM admin_invitations WHERE email = $1 AND used = FALSE AND expires_at > NOW()',
      [email]
    );
    if (existingInvitation.rows.length > 0) {
      return res.status(400).json({ 
        error: { message: 'Pending invitation already exists for this email' } 
      });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation
    const result = await query(
      `INSERT INTO admin_invitations (invited_by, email, role, country, token, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [invitedBy, email, role, country, token, expiresAt]
    );

    logger.info(`Invitation sent to ${email} by ${req.user.email}`);

    res.json({
      success: true,
      data: {
        invitation: result.rows[0],
        invitationUrl: `${process.env.FRONTEND_URL}/invite/${token}`
      }
    });
  } catch (error) {
    logger.error('Send invitation error:', error);
    res.status(500).json({ error: { message: 'Failed to send invitation' } });
  }
};

// Get invitations
const getInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let queryText = `
      SELECT i.*, u.name as invited_by_name, u.email as invited_by_email
      FROM admin_invitations i
      JOIN users u ON i.invited_by = u.id
    `;
    let params = [];

    if (userRole !== 'super_admin') {
      queryText += ' WHERE i.invited_by = $1';
      params.push(userId);
    }

    queryText += ' ORDER BY i.created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: { invitations: result.rows }
    });
  } catch (error) {
    logger.error('Get invitations error:', error);
    res.status(500).json({ error: { message: 'Failed to get invitations' } });
  }
};

// Cancel invitation
const cancelInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let queryText = 'DELETE FROM admin_invitations WHERE id = $1';
    let params = [id];

    if (userRole !== 'super_admin') {
      queryText += ' AND invited_by = $2';
      params.push(userId);
    }

    queryText += ' RETURNING *';

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: { message: 'Invitation not found or access denied' } 
      });
    }

    res.json({
      success: true,
      data: { message: 'Invitation cancelled successfully' }
    });
  } catch (error) {
    logger.error('Cancel invitation error:', error);
    res.status(500).json({ error: { message: 'Failed to cancel invitation' } });
  }
};

// Verify invitation (public)
const verifyInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await query(
      `SELECT i.*, u.name as invited_by_name
       FROM admin_invitations i
       JOIN users u ON i.invited_by = u.id
       WHERE i.token = $1 AND i.used = FALSE AND i.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: { message: 'Invalid or expired invitation' } 
      });
    }

    const invitation = result.rows[0];

    res.json({
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
        country: invitation.country,
        invitedBy: invitation.invited_by_name
      }
    });
  } catch (error) {
    logger.error('Verify invitation error:', error);
    res.status(500).json({ error: { message: 'Failed to verify invitation' } });
  }
};

// Accept invitation (public)
const acceptInvitation = async (req, res) => {
  try {
    const { token, password, name } = req.body;

    // Verify invitation
    const invitationResult = await query(
      'SELECT * FROM admin_invitations WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
      [token]
    );

    if (invitationResult.rows.length === 0) {
      return res.status(404).json({ 
        error: { message: 'Invalid or expired invitation' } 
      });
    }

    const invitation = invitationResult.rows[0];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userResult = await query(
      `INSERT INTO users (name, email, password, role, assigned_country, invited_by, can_invite_others, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, name, email, role, assigned_country`,
      [
        name,
        invitation.email,
        hashedPassword,
        invitation.role,
        invitation.country,
        invitation.invited_by,
        invitation.role === 'admin'
      ]
    );

    // Mark invitation as used
    await query(
      'UPDATE admin_invitations SET used = TRUE, accepted_at = NOW() WHERE id = $1',
      [invitation.id]
    );

    logger.info(`Invitation accepted by ${invitation.email}`);

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        message: 'Account created successfully'
      }
    });
  } catch (error) {
    logger.error('Accept invitation error:', error);
    res.status(500).json({ error: { message: 'Failed to accept invitation' } });
  }
};

// Get users
const getUsers = async (req, res) => {
  try {
    const { country, role, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const userRole = req.user.role;
    const userCountry = req.user.assigned_country;

    let queryText = `
      SELECT id, name, email, role, assigned_country, created_at, last_login
      FROM users
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 0;

    // Country filtering based on user role
    if (userRole === 'admin') {
      queryText += ` AND assigned_country = $${++paramCount}`;
      params.push(userCountry);
    } else if (country) {
      queryText += ` AND assigned_country = $${++paramCount}`;
      params.push(country);
    }

    // Role filtering
    if (role) {
      queryText += ` AND role = $${++paramCount}`;
      params.push(role);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    let countParams = [];
    let countParamCount = 0;

    if (userRole === 'admin') {
      countQuery += ` AND assigned_country = $${++countParamCount}`;
      countParams.push(userCountry);
    } else if (country) {
      countQuery += ` AND assigned_country = $${++countParamCount}`;
      countParams.push(country);
    }

    if (role) {
      countQuery += ` AND role = $${++countParamCount}`;
      countParams.push(role);
    }

    const countResult = await query(countQuery, countParams);

    res.json({
      success: true,
      data: {
        users: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count)
        }
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: { message: 'Failed to get users' } });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const userRole = req.user.role;

    // Permission checks
    if (role === 'admin' && userRole !== 'super_admin') {
      return res.status(403).json({ 
        error: { message: 'Only super admins can assign admin role' } 
      });
    }

    const result = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({ error: { message: 'Failed to update user role' } });
  }
};

// Update user country
const updateUserCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { country } = req.body;

    const result = await query(
      'UPDATE users SET assigned_country = $1 WHERE id = $2 RETURNING id, name, email, assigned_country',
      [country, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    logger.error('Update user country error:', error);
    res.status(500).json({ error: { message: 'Failed to update user country' } });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Cannot delete yourself
    if (id === userId) {
      return res.status(400).json({ 
        error: { message: 'Cannot delete your own account' } 
      });
    }

    // Get target user info
    const targetUser = await query('SELECT role, assigned_country FROM users WHERE id = $1', [id]);
    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const target = targetUser.rows[0];

    // Permission checks
    if (userRole === 'admin') {
      if (target.role !== 'user' || target.assigned_country !== req.user.assigned_country) {
        return res.status(403).json({ 
          error: { message: 'You can only delete regular users in your country' } 
        });
      }
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING name, email', [id]);

    res.json({
      success: true,
      data: { message: `User ${result.rows[0].name} deleted successfully` }
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: { message: 'Failed to delete user' } });
  }
};

// Get admin stats
const getAdminStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userCountry = req.user.assigned_country;

    let whereClause = '';
    let params = [];

    if (userRole === 'admin') {
      whereClause = 'WHERE assigned_country = $1';
      params.push(userCountry);
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
        COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderators,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
      FROM users ${whereClause}
    `;

    const result = await query(statsQuery, params);

    res.json({
      success: true,
      data: { stats: result.rows[0] }
    });
  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({ error: { message: 'Failed to get admin stats' } });
  }
};

module.exports = {
  sendInvitation,
  getInvitations,
  cancelInvitation,
  verifyInvitation,
  acceptInvitation,
  getUsers,
  updateUserRole,
  updateUserCountry,
  deleteUser,
  getAdminStats
};