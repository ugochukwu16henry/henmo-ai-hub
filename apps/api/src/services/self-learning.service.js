const fs = require('fs').promises;
const path = require('path');
const { query } = require('../config/database');
const anthropic = require('@anthropic-ai/sdk');

class SelfLearningService {
  constructor() {
    this.anthropic = new anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.learningPath = path.join(__dirname, '../../learning-materials');
    this.initializeLearningSystem();
  }

  async initializeLearningSystem() {
    try {
      await fs.mkdir(this.learningPath, { recursive: true });
      await this.createLearningTables();
    } catch (error) {
      console.error('Learning system initialization error:', error);
    }
  }

  async createLearningTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS learning_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        material_type VARCHAR(50) NOT NULL,
        source VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        approved_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE,
        tags TEXT[],
        embedding VECTOR(1536)
      )`,
      
      `CREATE TABLE IF NOT EXISTS learning_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        material_id UUID REFERENCES learning_materials(id),
        insights_generated TEXT,
        patterns_learned TEXT[],
        knowledge_updated BOOLEAN DEFAULT FALSE,
        session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      `CREATE TABLE IF NOT EXISTS knowledge_base (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        topic VARCHAR(255) NOT NULL,
        knowledge_data JSONB NOT NULL,
        confidence_score FLOAT DEFAULT 0.5,
        source_materials UUID[],
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        version INTEGER DEFAULT 1
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_learning_materials_status ON learning_materials(status);`,
      `CREATE INDEX IF NOT EXISTS idx_knowledge_base_topic ON knowledge_base(topic);`
    ];

    for (const table of tables) {
      try {
        await query(table);
      } catch (error) {
        console.log('Table creation skipped:', error.message);
      }
    }
  }

  async submitLearningMaterial(title, content, materialType, source, userId) {
    const result = await query(
      `INSERT INTO learning_materials (title, content, material_type, source, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [title, content, materialType, source]
    );

    return result.rows[0];
  }

  async approveLearningMaterial(materialId, userId) {
    const result = await query(
      `UPDATE learning_materials 
       SET status = 'approved', approved_by = $1, processed_at = NOW()
       WHERE id = $2 RETURNING *`,
      [userId, materialId]
    );

    if (result.rows.length > 0) {
      await this.processApprovedMaterial(result.rows[0]);
    }

    return result.rows[0];
  }

  async processApprovedMaterial(material) {
    try {
      // Extract knowledge and patterns from the material
      const analysis = await this.analyzeContent(material.content, material.material_type);
      
      // Store learning session
      await query(
        `INSERT INTO learning_sessions (material_id, insights_generated, patterns_learned)
         VALUES ($1, $2, $3)`,
        [material.id, analysis.insights, analysis.patterns]
      );

      // Update knowledge base
      await this.updateKnowledgeBase(analysis, material.id);

      // Save processed material to file system
      await this.saveMaterialToFile(material, analysis);

      return analysis;
    } catch (error) {
      console.error('Material processing error:', error);
      throw error;
    }
  }

  async analyzeContent(content, materialType) {
    const prompt = `Analyze this ${materialType} learning material and extract:

1. **Key Concepts & Knowledge Points**
2. **Patterns & Rules**
3. **Best Practices**
4. **Code Examples** (if applicable)
5. **Problem-Solution Pairs**
6. **Technical Insights**

Content:
${content}

Provide structured analysis that can be used to improve AI responses and capabilities.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    const analysisText = response.content[0].text;
    
    // Extract patterns using AI
    const patternPrompt = `From this analysis, extract specific patterns as a JSON array:
    ${analysisText}
    
    Return only a JSON array of pattern strings.`;

    const patternResponse = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: patternPrompt }]
    });

    let patterns = [];
    try {
      patterns = JSON.parse(patternResponse.content[0].text);
    } catch {
      patterns = [patternResponse.content[0].text];
    }

    return {
      insights: analysisText,
      patterns: patterns,
      timestamp: new Date().toISOString()
    };
  }

  async updateKnowledgeBase(analysis, materialId) {
    // Extract topics from insights
    const topicPrompt = `Extract main topics from this analysis as a JSON array:
    ${analysis.insights}
    
    Return only a JSON array of topic strings (max 5 topics).`;

    const topicResponse = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: topicPrompt }]
    });

    let topics = [];
    try {
      topics = JSON.parse(topicResponse.content[0].text);
    } catch {
      topics = ['general'];
    }

    // Update knowledge base for each topic
    for (const topic of topics) {
      const existingKnowledge = await query(
        'SELECT * FROM knowledge_base WHERE topic = $1',
        [topic]
      );

      if (existingKnowledge.rows.length > 0) {
        // Update existing knowledge
        const current = existingKnowledge.rows[0];
        const updatedData = {
          ...current.knowledge_data,
          insights: [...(current.knowledge_data.insights || []), analysis.insights],
          patterns: [...(current.knowledge_data.patterns || []), ...analysis.patterns],
          lastUpdate: new Date().toISOString()
        };

        await query(
          `UPDATE knowledge_base 
           SET knowledge_data = $1, last_updated = NOW(), version = version + 1,
               source_materials = array_append(source_materials, $2)
           WHERE topic = $3`,
          [JSON.stringify(updatedData), materialId, topic]
        );
      } else {
        // Create new knowledge entry
        const knowledgeData = {
          insights: [analysis.insights],
          patterns: analysis.patterns,
          created: new Date().toISOString()
        };

        await query(
          `INSERT INTO knowledge_base (topic, knowledge_data, source_materials)
           VALUES ($1, $2, $3)`,
          [topic, JSON.stringify(knowledgeData), [materialId]]
        );
      }
    }
  }

  async saveMaterialToFile(material, analysis) {
    const fileName = `${material.id}_${Date.now()}.json`;
    const filePath = path.join(this.learningPath, fileName);
    
    const fileData = {
      material: material,
      analysis: analysis,
      processedAt: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2));
  }

  async getPendingMaterials() {
    const result = await query(
      `SELECT * FROM learning_materials 
       WHERE status = 'pending' 
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getKnowledgeBase(topic = null) {
    let queryText = 'SELECT * FROM knowledge_base';
    let params = [];

    if (topic) {
      queryText += ' WHERE topic ILIKE $1';
      params.push(`%${topic}%`);
    }

    queryText += ' ORDER BY last_updated DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  async enhanceAIResponse(userQuery, baseResponse) {
    try {
      // Find relevant knowledge
      const relevantKnowledge = await this.findRelevantKnowledge(userQuery);
      
      if (relevantKnowledge.length === 0) {
        return baseResponse;
      }

      // Enhance response with learned knowledge
      const enhancementPrompt = `Enhance this AI response using the learned knowledge:

Original Query: ${userQuery}
Base Response: ${baseResponse}

Learned Knowledge:
${relevantKnowledge.map(k => `Topic: ${k.topic}\nInsights: ${JSON.stringify(k.knowledge_data)}`).join('\n\n')}

Provide an enhanced response that incorporates the learned knowledge while maintaining accuracy.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: enhancementPrompt }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Response enhancement error:', error);
      return baseResponse;
    }
  }

  async findRelevantKnowledge(query) {
    // Simple keyword matching for now
    const result = await query(
      `SELECT * FROM knowledge_base 
       WHERE topic ILIKE $1 OR knowledge_data::text ILIKE $1
       ORDER BY confidence_score DESC LIMIT 3`,
      [`%${query}%`]
    );
    return result.rows;
  }

  async getLearningStats() {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_materials,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_materials,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_materials,
        (SELECT COUNT(*) FROM knowledge_base) as knowledge_entries,
        (SELECT COUNT(*) FROM learning_sessions) as learning_sessions
      FROM learning_materials
    `);

    return stats.rows[0];
  }
}

module.exports = new SelfLearningService();