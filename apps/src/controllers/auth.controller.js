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
    deviceInfo: req.headers['user-agent'],
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

// POST /api/v1/auth/logout-all
const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.userId);

  res.json({
    success: true,
    message: 'Logged out from all devices',
  });
});

// POST /api/v1/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  await authService.changePassword(req.userId, currentPassword, newPassword);

  res.json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
});

// POST /api/v1/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  await authService.forgotPassword(email);

  // Always return success to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account exists, a password reset email has been sent.',
  });
});

// POST /api/v1/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  
  await authService.resetPassword(token, password);

  res.json({
    success: true,
    message: 'Password reset successful. Please login with your new password.',
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
  logoutAll,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
};