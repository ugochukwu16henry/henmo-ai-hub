const Anthropic = require('@anthropic-ai/sdk');
const config = require('../../config');
const logger = require('../../utils/logger');

class AnthropicService {
  constructor() {
    if (config.ai.anthropic.apiKey) {
      this.client = new Anthropic({
        apiKey: config.ai.anthropic.apiKey,
      });
    }
  }

  isAvailable() {
    return !!this.client;
  }

  async chat({ messages, model = 'claude-sonnet', systemPrompt, maxTokens = 4096 }) {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const modelName = config.ai.anthropic.models[model] || config.ai.anthropic.models['claude-sonnet'];

      // Format messages for Anthropic
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const response = await this.client.messages.create({
        model: modelName,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: formattedMessages,
      });

      const content = response.content[0].text;
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

      logger.info('Anthropic API call successful', {
        model: modelName,
        tokensUsed,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      });

      return {
        content,
        tokensUsed,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        model: modelName,
        provider: 'anthropic',
      };
    } catch (error) {
      logger.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  // Streaming chat (for future use)
  async *streamChat({ messages, model = 'claude-sonnet', systemPrompt, maxTokens = 4096 }) {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not configured');
    }

    const modelName = config.ai.anthropic.models[model] || config.ai.anthropic.models['claude-sonnet'];
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const stream = await this.client.messages.create({
      model: modelName,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: formattedMessages,
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}

module.exports = new AnthropicService();