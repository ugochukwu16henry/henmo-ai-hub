// apps/api/src/services/ai.service.js

const config = require('../config');
const logger = require('../utils/logger');
const { ApiError } = require('../middleware/errorHandler');

// AI Provider Libraries
const { Anthropic } = require('@anthropic-ai/sdk'); 
// Assuming you will use Anthropic SDK
// You will add other providers (OpenAI, Google) clients here later

class AIService {
    constructor() {
        this.config = config.ai;
        this.providers = {};
        this.initializeClients();
    }

    /**
     * Initializes AI clients (e.g., Anthropic, OpenAI) based on config.
     */
    initializeClients() {
        // --- Anthropic Client ---
        if (this.config.anthropic.apiKey) {
            try {
                this.providers.anthropic = new Anthropic({ apiKey: this.config.anthropic.apiKey });
                logger.info('Anthropic AI Client initialized.');
            } catch (error) {
                logger.error('Failed to initialize Anthropic client:', error.message);
            }
        } else {
            logger.warn('ANTHROPIC_API_KEY is missing. Anthropic provider disabled.');
        }

        // --- Add other providers here later (e.g., OpenAI, Google) ---

        if (Object.keys(this.providers).length === 0) {
            logger.error('No AI providers could be initialized. Please check API keys in .env');
        }
    }

    /**
     * Gets the current default provider client.
     * @returns {object} The initialized AI client.
     */
    getDefaultClient() {
        const providerName = this.config.defaultProvider;
        const client = this.providers[providerName];

        if (!client) {
            throw ApiError.internal('Default AI provider client is not initialized or invalid.');
        }
        return client;
    }

    /**
     * Retrieves a list of available AI providers and their status.
     * This is used for the /health check endpoint.
     * @returns {object} A status object for each provider.
     */
    getAvailableProviders() {
        const providersStatus = {};

        // Check initialization status for each configured provider
        if (config.ai.anthropic.apiKey) {
            providersStatus.anthropic = {
                status: this.providers.anthropic ? 'active' : 'inactive (initialization failed)',
                model: this.config.anthropic.models['claude-sonnet'],
            };
        } else {
            providersStatus.anthropic = { status: 'disabled (no API key)' };
        }

        // Add other providers here later

        return providersStatus;
    }
    
    /**
     * Primary function to send a prompt and get a response.
     * This will be expanded later to handle conversation history and memory.
     */
    async generateResponse(messages, options = {}) {
        const client = this.getDefaultClient();
        const model = options.model || this.config.defaultModel;

        if (this.config.defaultProvider === 'anthropic') {
            try {
                // Simplified Anthropic API call for demonstration
                const response = await client.messages.create({
                    model: model,
                    max_tokens: 4096,
                    messages: messages,
                });
                return response.content[0].text;
            } catch (error) {
                logger.error('Anthropic API request failed:', error);
                throw ApiError.internal('AI provider error.');
            }
        }
        
        // Add logic for other providers (OpenAI, Google) here later
        
        throw ApiError.internal(`Unsupported AI provider: ${this.config.defaultProvider}`);
    }
}

// Export a singleton instance
module.exports = new AIService();