require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'henmo_ai',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  logging: { level: process.env.LOG_LEVEL || "debug" },
// -------- NEW AI CONFIGURATION STARTS HERE --------
   ai: {
     defaultProvider: process.env.DEFAULT_AI_PROVIDER || 'anthropic',
     defaultModel: process.env.DEFAULT_MODEL || 'claude-sonnet-4-20250514',
     maxContextMessages: parseInt(process.env.MAX_CONTEXT_MESSAGES, 10) || 20,
     maxMemoryResults: parseInt(process.env.MAX_MEMORY_RESULTS, 10) || 5,
     
     anthropic: {
       apiKey: process.env.ANTHROPIC_API_KEY,
       models: {
         'claude-opus': 'claude-opus-4-20250514',
         'claude-sonnet': 'claude-sonnet-4-20250514',
         'claude-haiku': 'claude-haiku-4-20250514',
       },
     },
     
     openai: {
       apiKey: process.env.OPENAI_API_KEY,
       models: {
         'gpt-4': 'gpt-4-turbo-preview',
         'gpt-4-turbo': 'gpt-4-turbo',
         'gpt-3.5': 'gpt-3.5-turbo',
       },
     },
     
     google: {
       apiKey: process.env.GOOGLE_AI_API_KEY,
       models: {
         'gemini-pro': 'gemini-pro',
         'gemini-pro-vision': 'gemini-pro-vision',
       },
     },
   },
// -------- NEW AI CONFIGURATION ENDS HERE --------

  subscriptionLimits: {
    free: {
      messagesPerDay: 50,
      memoryItems: 5,
    },
    starter: {
      messagesPerDay: 500,
      memoryItems: 100,
    },
    pro: {
      messagesPerDay: -1,
      memoryItems: -1,
    },
    enterprise: {
      messagesPerDay: -1,
      memoryItems: -1,
    },
  },
};
