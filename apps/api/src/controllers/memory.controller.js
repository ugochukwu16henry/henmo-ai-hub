const memoryService = require('../services/memory.service');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/v1/memory
const create = asyncHandler(async (req, res) => {
  const { title, content, contentType, tags, isPinned } = req.body;

  const memory = await memoryService.create(req.userId, {
    title,
    content,
    contentType,
    tags,
    isPinned,
  });

  res.status(201).json({
    success: true,
    message: 'Memory created',
    data: memory,
  });
});

// GET /api/v1/memory
const list = asyncHandler(async (req, res) => {
  const { page, limit, contentType, tags, search, pinned } = req.query;

  const result = await memoryService.list(req.userId, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
    contentType,
    tags: tags ? tags.split(',') : undefined,
    search,
    pinnedOnly: pinned === 'true',
  });

  res.json({
    success: true,
    data: result.memories,
    pagination: result.pagination,
  });
});

// GET /api/v1/memory/search
const search = asyncHandler(async (req, res) => {
  const { q, limit, contentType } = req.query;

  const results = await memoryService.search(req.userId, {
    query: q,
    limit: parseInt(limit, 10) || 5,
    contentType,
  });

  res.json({
    success: true,
    data: results,
  });
});

// GET /api/v1/memory/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await memoryService.getStats(req.userId);

  res.json({
    success: true,
    data: stats,
  });
});

// GET /api/v1/memory/tags
const getTags = asyncHandler(async (req, res) => {
  const tags = await memoryService.getTags(req.userId);

  res.json({
    success: true,
    data: tags,
  });
});

// GET /api/v1/memory/:id
const getById = asyncHandler(async (req, res) => {
  const memory = await memoryService.getById(req.params.id, req.userId);

  res.json({
    success: true,
    data: memory,
  });
});

// PUT /api/v1/memory/:id
const update = asyncHandler(async (req, res) => {
  const { title, content, contentType, tags, isPinned } = req.body;

  const memory = await memoryService.update(req.params.id, req.userId, {
    title,
    content,
    contentType,
    tags,
    is_pinned: isPinned,
  });

  res.json({
    success: true,
    message: 'Memory updated',
    data: memory,
  });
});

// DELETE /api/v1/memory/:id
const deleteMemory = asyncHandler(async (req, res) => {
  await memoryService.delete(req.params.id, req.userId);

  res.json({
    success: true,
    message: 'Memory deleted',
  });
});

module.exports = {
  create,
  list,
  search,
  getStats,
  getTags,
  getById,
  update,
  deleteMemory,
};