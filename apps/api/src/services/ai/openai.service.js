const OpenAI = require('openai');
const config = require('../../config');
const logger = require('../../utils/logger');

class OpenAIService {
  constructor() {
    if (config.ai.openai.apiKey) {
      this.client = new OpenAI({
        apiKey: config.ai.openai.apiKey,
      });
    }
  }

  isAvailable() {
    return !!this.client;
  }

  async chat({ messages, model = 'gpt-4', systemPrompt, maxTokens = 4096 }) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const modelName = config.ai.openai.models[model] || config.ai.openai.models['gpt-4'];

      // Format messages for OpenAI
      const formattedMessages = [];
      
      if (systemPrompt) {
        formattedMessages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      formattedMessages.push(...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })));

      const response = await this.client.chat.completions.create({
        model: modelName,
        messages: formattedMessages,
        max_tokens: maxTokens,
      });

      const content = response.choices[0].message.content;
      const tokensUsed = response.usage.total_tokens;

      logger.info('OpenAI API call successful', {
        model: modelName,
        tokensUsed,
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
      });

      return {
        content,
        tokensUsed,
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
        model: modelName,
        provider: 'openai',
      };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

module.exports = new OpenAIService();