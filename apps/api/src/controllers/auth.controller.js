const authService = require('../services/auth.service');

// POST /api/auth/register
const register = async (req, res) => {
  try {
  const { email, password, name, country, city } = req.body;
  
  const result = await authService.register({
    email,
    password,
    name,
    country,
    city,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login({
      email,
      password,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const tokens = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed',
      data: tokens,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    await authService.logout(req.user.id, refreshToken);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};