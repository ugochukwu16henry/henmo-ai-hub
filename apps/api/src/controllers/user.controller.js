const userService = require('../services/user.service');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/v1/users/me
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.userId);

  res.json({
    success: true,
    data: user,
  });
});

// PUT /api/v1/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.userId, req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

// GET /api/v1/users (admin - list all users)
const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, role, status, country, search } = req.query;
  
  const result = await userService.list({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
    role,
    status,
    country,
    search,
  });

  res.json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
});

// GET /api/v1/users/:id (admin - get user details)
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);

  res.json({
    success: true,
    data: user,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  listUsers,
  getUserById,
};