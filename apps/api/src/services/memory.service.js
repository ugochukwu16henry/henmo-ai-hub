const db = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class MemoryService {
  // Create new memory
  async create(userId, { title, content, contentType = 'note', tags = [], isPinned = false }) {
    // Check subscription limits
    await this.checkSubscriptionLimit(userId);

    const result = await db.query(
      `INSERT INTO ai_memory (user_id, title, content, content_type, tags, is_pinned)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, title, content, content_type, tags, is_pinned, created_at`,
      [userId, title, content, contentType, tags, isPinned]
    );

    logger.info('Memory created', { memoryId: result.rows[0].id, userId });

    return result.rows[0];
  }

  // Get memory by ID
  async getById(memoryId, userId) {
    const result = await db.query(
      `SELECT id, user_id, title, content, content_type, tags, is_pinned, 
              metadata, created_at, updated_at
       FROM ai_memory
       WHERE id = $1 AND user_id = $2`,
      [memoryId, userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Memory not found');
    }

    return result.rows[0];
  }

  // List user's memories
  async list(userId, { page = 1, limit = 20, contentType, tags, search, pinnedOnly = false }) {
    const offset = (page - 1) * limit;
    const conditions = ['user_id = $1'];
    const values = [userId];
    let paramIndex = 2;

    if (contentType) {
      conditions.push(`content_type = $${paramIndex}`);
      values.push(contentType);
      paramIndex++;
    }

    if (tags && tags.length > 0) {
      conditions.push(`tags && $${paramIndex}`);
      values.push(tags);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (pinnedOnly) {
      conditions.push('is_pinned = true');
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM ai_memory ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Get memories
    values.push(limit, offset);
    const result = await db.query(
      `SELECT id, title, content, content_type, tags, is_pinned, created_at, updated_at
       FROM ai_memory ${whereClause}
       ORDER BY is_pinned DESC, updated_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    return {
      memories: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update memory
  async update(memoryId, userId, updates) {
    const allowedFields = ['title', 'content', 'content_type', 'tags', 'is_pinned'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw ApiError.badRequest('No valid fields to update');
    }

    values.push(memoryId, userId);

    const result = await db.query(
      `UPDATE ai_memory 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING id, title, content, content_type, tags, is_pinned, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Memory not found');
    }

    logger.info('Memory updated', { memoryId, userId });

    return result.rows[0];
  }

  // Delete memory
  async delete(memoryId, userId) {
    const result = await db.query(
      'DELETE FROM ai_memory WHERE id = $1 AND user_id = $2 RETURNING id',
      [memoryId, userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Memory not found');
    }

    logger.info('Memory deleted', { memoryId, userId });
  }

  // Search memories (simple text search for now)
  async search(userId, { query, limit = 5, contentType }) {
    const conditions = ['user_id = $1'];
    const values = [userId];
    let paramIndex = 2;

    if (query) {
      conditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      values.push(`%${query}%`);
      paramIndex++;
    }

    if (contentType) {
      conditions.push(`content_type = $${paramIndex}`);
      values.push(contentType);
      paramIndex++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    values.push(limit);

    const result = await db.query(
      `SELECT id, title, content, content_type, tags, created_at
       FROM ai_memory ${whereClause}
       ORDER BY is_pinned DESC, updated_at DESC
       LIMIT $${paramIndex}`,
      values
    );

    return result.rows;
  }

  // Get relevant memories for AI context
  async getRelevantMemories(userId, query, limit = 5) {
    // For now, simple keyword search
    // TODO: Implement vector similarity search with embeddings
    return await this.search(userId, { query, limit });
  }

  // Get memory statistics
  async getStats(userId) {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_memories,
        COUNT(*) FILTER (WHERE content_type = 'note') as notes,
        COUNT(*) FILTER (WHERE content_type = 'code') as code_snippets,
        COUNT(*) FILTER (WHERE content_type = 'document') as documents,
        COUNT(*) FILTER (WHERE is_pinned = true) as pinned
       FROM ai_memory
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }

  // Check subscription limits
  async checkSubscriptionLimit(userId) {
    const config = require('../config');
    
    // Get user's subscription tier
    const userResult = await db.query(
      'SELECT subscription_tier FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    const tier = userResult.rows[0].subscription_tier;
    const limits = config.subscriptionLimits[tier];

    // Check if user has unlimited memories
    if (limits.memoryItems === -1) {
      return;
    }

    // Count current memories
    const countResult = await db.query(
      'SELECT COUNT(*) FROM ai_memory WHERE user_id = $1',
      [userId]
    );

    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= limits.memoryItems) {
      throw ApiError.forbidden(
        `Memory limit reached (${limits.memoryItems}). Upgrade your subscription for more storage.`
      );
    }
  }

  // Get all unique tags for a user
  async getTags(userId) {
    const result = await db.query(
      `SELECT DISTINCT unnest(tags) as tag
       FROM ai_memory
       WHERE user_id = $1 AND tags IS NOT NULL
       ORDER BY tag`,
      [userId]
    );

    return result.rows.map(row => row.tag);
  }
}

module.exports = new MemoryService();