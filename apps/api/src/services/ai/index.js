const anthropicService = require('./anthropic.service');
const openaiService = require('./openai.service');
const config = require('../../config');
const { ApiError } = require('../../middleware/errorHandler');

class AIService {
  getProvider(providerName) {
    const providers = {
      anthropic: anthropicService,
      openai: openaiService,
    };

    const provider = providers[providerName];
    if (!provider) {
      throw ApiError.badRequest(`Unknown AI provider: ${providerName}`);
    }

    if (!provider.isAvailable()) {
      throw ApiError.badRequest(`${providerName} API key not configured`);
    }

    return provider;
  }

  async chat({ provider = config.ai.defaultProvider, model, messages, systemPrompt, maxTokens }) {
    const aiProvider = this.getProvider(provider);
    return await aiProvider.chat({ messages, model, systemPrompt, maxTokens });
  }

  getAvailableProviders() {
    return {
      anthropic: anthropicService.isAvailable(),
      openai: openaiService.isAvailable(),
    };
  }
}

module.exports = new AIService();