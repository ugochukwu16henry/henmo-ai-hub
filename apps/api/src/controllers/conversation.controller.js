const conversationService = require('../services/conversation.service');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/v1/conversations
const create = asyncHandler(async (req, res) => {
  const { title, mode, provider, model } = req.body;

  const conversation = await conversationService.create(req.userId, {
    title,
    mode,
    provider,
    model,
  });

  res.status(201).json({
    success: true,
    message: 'Conversation created',
    data: conversation,
  });
});

// GET /api/v1/conversations
const list = asyncHandler(async (req, res) => {
  const { page, limit, mode, archived } = req.query;

  const result = await conversationService.list(req.userId, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
    mode,
    isArchived: archived === 'true',
  });

  res.json({
    success: true,
    data: result.conversations,
    pagination: result.pagination,
  });
});

// GET /api/v1/conversations/:id
const getById = asyncHandler(async (req, res) => {
  const conversation = await conversationService.getWithMessages(
    req.params.id,
    req.userId
  );

  res.json({
    success: true,
    data: conversation,
  });
});

// POST /api/v1/conversations/:id/messages
const sendMessage = asyncHandler(async (req, res) => {
  const { content, provider, model } = req.body;

  const result = await conversationService.sendMessage(
    req.params.id,
    req.userId,
    { content, provider, model }
  );

  res.json({
    success: true,
    data: result,
  });
});

// PUT /api/v1/conversations/:id
const update = asyncHandler(async (req, res) => {
  const { title, mode, is_archived } = req.body;

  const conversation = await conversationService.update(
    req.params.id,
    req.userId,
    { title, mode, is_archived }
  );

  res.json({
    success: true,
    message: 'Conversation updated',
    data: conversation,
  });
});

// DELETE /api/v1/conversations/:id
const deleteConversation = asyncHandler(async (req, res) => {
  await conversationService.delete(req.params.id, req.userId);

  res.json({
    success: true,
    message: 'Conversation deleted',
  });
});

// GET /api/v1/conversations/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await conversationService.getStats(req.userId);

  res.json({
    success: true,
    data: stats,
  });
});

module.exports = {
  create,
  list,
  getById,
  sendMessage,
  update,
  deleteConversation,
  getStats,
};