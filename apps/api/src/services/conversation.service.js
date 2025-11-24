const db = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const aiService = require('./ai');
const config = require('../config');

class ConversationService {
  // Create new conversation
  async create(userId, { title, mode = 'general', provider, model }) {
    const result = await db.query(
      `INSERT INTO conversations (user_id, title, mode, ai_provider, model_used)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, mode, ai_provider, model_used, message_count, created_at`,
      [userId, title || 'New Conversation', mode, provider || config.ai.defaultProvider, model]
    );

    logger.info('Conversation created', { conversationId: result.rows[0].id, userId });

    return result.rows[0];
  }

  // Get conversation by ID
  async getById(conversationId, userId) {
    const result = await db.query(
      `SELECT id, user_id, title, mode, ai_provider, model_used, 
              message_count, token_count, is_archived, metadata, created_at, updated_at
       FROM conversations 
       WHERE id = $1 AND user_id = $2`,
      [conversationId, userId]
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Conversation not found');
    }

    return result.rows[0];
  }

  // Get conversation with messages
  async getWithMessages(conversationId, userId, limit = 50) {
    // Get conversation
    const conversation = await this.getById(conversationId, userId);

    // Get messages
    const messagesResult = await db.query(
      `SELECT id, conversation_id, role, content, tokens_used, metadata, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [conversationId, limit]
    );

    // Reverse to get chronological order
    const messages = messagesResult.rows.reverse();

    return {
      ...conversation,
      messages,
    };
  }

  // List user's conversations
  async list(userId, { page = 1, limit = 20, mode, isArchived = false }) {
    const offset = (page - 1) * limit;
    const conditions = ['user_id = $1'];
    const values = [userId];
    let paramIndex = 2;

    if (mode) {
      conditions.push(`mode = $${paramIndex}`);
      values.push(mode);
      paramIndex++;
    }

    conditions.push(`is_archived = $${paramIndex}`);
    values.push(isArchived);
    paramIndex++;

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM conversations ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Get conversations
    values.push(limit, offset);
    const result = await db.query(
      `SELECT id, title, mode, ai_provider, model_used, message_count, 
              token_count, is_archived, created_at, updated_at
       FROM conversations ${whereClause}
       ORDER BY updated_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      values
    );

    return {
      conversations: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Add message to conversation
  async addMessage(conversationId, userId, { role, content, tokensUsed = 0, metadata = {} }) {
    // Verify conversation belongs to user
    await this.getById(conversationId, userId);

    // Insert message
    const result = await db.query(
      `INSERT INTO messages (conversation_id, role, content, tokens_used, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, conversation_id, role, content, tokens_used, created_at`,
      [conversationId, role, content, tokensUsed, JSON.stringify(metadata)]
    );

    // Update conversation stats
    await db.query(
      `UPDATE conversations 
       SET message_count = message_count + 1,
           token_count = token_count + $1,
           updated_at = NOW()
       WHERE id = $2`,
      [tokensUsed, conversationId]
    );

    return result.rows[0];
  }

  // Send message and get AI response
  async sendMessage(conversationId, userId, { content, provider, model }) {
    // Get conversation with recent messages for context
    const conversation = await this.getWithMessages(conversationId, userId, config.ai.maxContextMessages);

    // Add user message
    const userMessage = await this.addMessage(conversationId, userId, {
      role: 'user',
      content,
    });

    try {
      // Prepare messages for AI
      const messages = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      messages.push({
        role: 'user',
        content,
      });

      // Build system prompt based on mode
      const systemPrompt = this.buildSystemPrompt(conversation.mode, userId);

      // Call AI
      const aiResponse = await aiService.chat({
        provider: provider || conversation.ai_provider,
        model: model || conversation.model_used,
        messages,
        systemPrompt,
      });

      // Save AI response
      const assistantMessage = await this.addMessage(conversationId, userId, {
        role: 'assistant',
        content: aiResponse.content,
        tokensUsed: aiResponse.tokensUsed,
        metadata: {
          provider: aiResponse.provider,
          model: aiResponse.model,
          inputTokens: aiResponse.inputTokens,
          outputTokens: aiResponse.outputTokens,
        },
      });

      logger.info('AI response generated', {
        conversationId,
        tokensUsed: aiResponse.tokensUsed,
        provider: aiResponse.provider,
      });

      return {
        userMessage,
        assistantMessage,
        tokensUsed: aiResponse.tokensUsed,
      };
    } catch (error) {
      logger.error('Error generating AI response:', error);
      throw ApiError.internal('Failed to generate AI response: ' + error.message);
    }
  }

  // Build system prompt based on conversation mode
  buildSystemPrompt(mode, userId) {
    const basePrompt = `You are ChatBoss, a highly intelligent AI assistant built by HenMo AI. You are helpful, creative, and always provide accurate information.`;

    const modePrompts = {
      general: `${basePrompt} You assist with general questions, creative tasks, and problem-solving.`,
      
      developer: `${basePrompt} You specialize in helping developers with:
- Code writing and debugging
- Software architecture and design patterns
- API integration and documentation
- Database design and optimization
- Best practices and code reviews
Always provide clear, well-commented code examples.`,
      
      learning: `${basePrompt} You are a patient teacher who:
- Explains complex topics simply
- Uses examples and analogies
- Breaks down information into digestible steps
- Encourages questions and deeper understanding`,
      
      business: `${basePrompt} You help with business and entrepreneurship:
- Business strategy and planning
- Market analysis
- Product development
- Startup advice and funding
Provide actionable, practical advice.`,
    };

    return modePrompts[mode] || modePrompts.general;
  }

  // Update conversation
  async update(conversationId, userId, updates) {
    const allowedFields = ['title', 'mode', 'is_archived'];
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

    values.push(conversationId, userId);

    const result = await db.query(
      `UPDATE conversations 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING id, title, mode, is_archived, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw ApiError.notFound('Conversation not found');
    }

    return result.rows[0];
  }

  // Delete conversation
  async delete(conversationId, userId) {
    // Verify ownership
    await this.getById(conversationId, userId);

    // Delete (messages are cascade deleted)
    await db.query(
      'DELETE FROM conversations WHERE id = $1',
      [conversationId]
    );

    logger.info('Conversation deleted', { conversationId, userId });
  }

  // Get conversation statistics
  async getStats(userId) {
    const result = await db.query(
      `SELECT 
        COUNT(*) as total_conversations,
        COALESCE(SUM(message_count), 0) as total_messages,
        COALESCE(SUM(token_count), 0) as total_tokens,
        COUNT(*) FILTER (WHERE is_archived = false) as active_conversations
       FROM conversations
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }
}

module.exports = new ConversationService();