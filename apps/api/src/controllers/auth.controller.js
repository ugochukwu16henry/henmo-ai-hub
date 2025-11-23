const authService = require('../services/auth.service');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
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
});

// POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
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
});

// POST /api/v1/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  const tokens = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: tokens,
  });
});

// POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  await authService.logout(req.userId, refreshToken);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};