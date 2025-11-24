const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memory.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createMemoryValidation,
  updateMemoryValidation,
  getMemoryValidation,
  listMemoriesValidation,
  searchMemoriesValidation,
} = require('../validators/memory.validator');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/memory/stats
router.get('/stats', memoryController.getStats);

// GET /api/v1/memory/tags
router.get('/tags', memoryController.getTags);

// GET /api/v1/memory/search
router.get('/search', searchMemoriesValidation, validate, memoryController.search);

// GET /api/v1/memory
router.get('/', listMemoriesValidation, validate, memoryController.list);

// POST /api/v1/memory
router.post('/', createMemoryValidation, validate, memoryController.create);

// GET /api/v1/memory/:id
router.get('/:id', getMemoryValidation, validate, memoryController.getById);

// PUT /api/v1/memory/:id
router.put('/:id', updateMemoryValidation, validate, memoryController.update);

// DELETE /api/v1/memory/:id
router.delete('/:id', getMemoryValidation, validate, memoryController.deleteMemory);

module.exports = router;