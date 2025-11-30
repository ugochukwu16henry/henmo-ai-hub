const { OpenAI } = require('openai')
let Pinecone = null;
try {
  Pinecone = require('@pinecone-database/pinecone').Pinecone;
} catch (error) {
  console.warn('@pinecone-database/pinecone not available - embeddings features disabled');
}

class EmbeddingsService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    if (Pinecone && process.env.PINECONE_API_KEY) {
      this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })
      this.index = this.pinecone.index('henmo-embeddings')
    } else {
      this.pinecone = null;
      this.index = null;
      console.warn('Pinecone not configured - vector search disabled');
    }
  }

  async createEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      })
      return response.data[0].embedding
    } catch (error) {
      throw new Error(`Embedding creation failed: ${error.message}`)
    }
  }

  async storeEmbedding(id, text, metadata = {}) {
    try {
      if (!this.index) {
        return { success: false, error: 'Pinecone not configured' }
      }
      const embedding = await this.createEmbedding(text)
      
      await this.index.upsert([{
        id,
        values: embedding,
        metadata: { text, ...metadata }
      }])

      return { success: true, id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async searchSimilar(query, topK = 5, filter = {}) {
    try {
      if (!this.index) {
        return { success: false, error: 'Pinecone not configured', matches: [] }
      }
      const queryEmbedding = await this.createEmbedding(query)
      
      const searchResponse = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter
      })

      return {
        success: true,
        matches: searchResponse.matches.map(match => ({
          id: match.id,
          score: match.score,
          text: match.metadata.text,
          metadata: match.metadata
        }))
      }
    } catch (error) {
      return { success: false, error: error.message, matches: [] }
    }
  }

  async ragQuery(query, userId, conversationId) {
    try {
      // Search for relevant context
      const contextResults = await this.searchSimilar(query, 3, {
        userId,
        type: 'memory'
      })

      if (!contextResults.success) {
        throw new Error('Context search failed')
      }

      // Build context from search results
      const context = contextResults.matches
        .map(match => match.text)
        .join('\n\n')

      // Create RAG prompt
      const ragPrompt = `Context information:
${context}

Question: ${query}

Please answer the question based on the context provided. If the context doesn't contain relevant information, say so.`

      return {
        success: true,
        prompt: ragPrompt,
        context: contextResults.matches
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async storeConversationMemory(conversationId, userId, messages) {
    try {
      const conversationText = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      const id = `conv_${conversationId}_${Date.now()}`
      
      return await this.storeEmbedding(id, conversationText, {
        userId,
        conversationId,
        type: 'conversation',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async storeUserMemory(userId, title, content, tags = []) {
    try {
      const id = `memory_${userId}_${Date.now()}`
      
      return await this.storeEmbedding(id, `${title}\n${content}`, {
        userId,
        title,
        type: 'memory',
        tags,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async deleteEmbedding(id) {
    try {
      if (!this.index) {
        return { success: false, error: 'Pinecone not configured' }
      }
      await this.index.deleteOne(id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

module.exports = new EmbeddingsService()