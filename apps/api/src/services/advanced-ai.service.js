const anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class AdvancedAIService {
  constructor() {
    this.anthropic = new anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeCode(code, language, task = 'analyze') {
    const prompt = `You are an expert code analyzer like Amazon Q. Analyze this ${language} code and provide:

1. **Code Quality Assessment**
2. **Security Vulnerabilities** 
3. **Performance Issues**
4. **Best Practices Violations**
5. **Refactoring Suggestions**
6. **Documentation Issues**

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Task: ${task}

Provide detailed, actionable feedback with specific line references and improvement suggestions.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      analysis: response.content[0].text,
      language,
      timestamp: new Date().toISOString()
    };
  }

  async processData(data, analysisType = 'general') {
    const prompt = `You are a data analysis expert. Analyze this data and provide insights:

Data Type: ${analysisType}
Data: ${JSON.stringify(data, null, 2)}

Provide:
1. **Data Summary & Statistics**
2. **Patterns & Trends**
3. **Anomalies & Outliers**
4. **Recommendations**
5. **Visualizations Suggestions**
6. **Data Quality Assessment**

Be thorough and provide actionable insights.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      insights: response.content[0].text,
      dataType: analysisType,
      timestamp: new Date().toISOString()
    };
  }

  async intelligentChat(message, context = [], files = []) {
    let systemPrompt = `You are HenMo AI, an advanced AI assistant with capabilities similar to Amazon Q Developer. You can:

- Analyze and review code in any programming language
- Debug and fix code issues
- Provide architectural guidance
- Analyze data and generate insights
- Process files and documents
- Answer technical questions with expertise
- Generate code solutions
- Perform security analysis
- Optimize performance

Be helpful, accurate, and provide detailed explanations with examples when needed.`;

    let userMessage = message;

    // Add file context if files are provided
    if (files && files.length > 0) {
      userMessage += '\n\nFiles provided:\n';
      files.forEach(file => {
        userMessage += `\n**${file.name}** (${file.type}):\n\`\`\`\n${file.content}\n\`\`\`\n`;
      });
    }

    // Add conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.slice(-10), // Last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: messages.filter(m => m.role !== 'system').concat([
        { role: 'user', content: systemPrompt + '\n\n' + userMessage }
      ])
    });

    return {
      response: response.content[0].text,
      model: 'claude-3-5-sonnet-20241022',
      timestamp: new Date().toISOString()
    };
  }

  async generateCode(requirements, language, framework = null) {
    const prompt = `Generate ${language} code based on these requirements:

Requirements: ${requirements}
Language: ${language}
Framework: ${framework || 'None specified'}

Provide:
1. **Complete, working code**
2. **Comments explaining key parts**
3. **Error handling**
4. **Best practices implementation**
5. **Usage examples**
6. **Dependencies needed**

Make the code production-ready and well-structured.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      code: response.content[0].text,
      language,
      framework,
      timestamp: new Date().toISOString()
    };
  }

  async debugCode(code, error, language) {
    const prompt = `Debug this ${language} code that's producing an error:

**Code:**
\`\`\`${language}
${code}
\`\`\`

**Error:**
${error}

Provide:
1. **Root cause analysis**
2. **Fixed code**
3. **Explanation of the fix**
4. **Prevention strategies**
5. **Testing recommendations**

Be thorough and educational in your response.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      debug: response.content[0].text,
      language,
      timestamp: new Date().toISOString()
    };
  }

  async securityAnalysis(code, language) {
    const prompt = `Perform a comprehensive security analysis of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Analyze for:
1. **SQL Injection vulnerabilities**
2. **XSS vulnerabilities**
3. **Authentication/Authorization issues**
4. **Input validation problems**
5. **Sensitive data exposure**
6. **Cryptographic issues**
7. **Dependency vulnerabilities**
8. **Configuration security**

Provide specific fixes and security best practices.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      securityReport: response.content[0].text,
      language,
      timestamp: new Date().toISOString()
    };
  }

  async optimizePerformance(code, language, context = '') {
    const prompt = `Optimize this ${language} code for better performance:

**Code:**
\`\`\`${language}
${code}
\`\`\`

**Context:** ${context}

Provide:
1. **Performance bottlenecks identified**
2. **Optimized code**
3. **Performance improvements explanation**
4. **Benchmarking suggestions**
5. **Scalability considerations**
6. **Memory usage optimization**

Focus on practical, measurable improvements.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3500,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      optimization: response.content[0].text,
      language,
      timestamp: new Date().toISOString()
    };
  }

  async explainCode(code, language, level = 'intermediate') {
    const prompt = `Explain this ${language} code for a ${level} developer:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. **High-level overview**
2. **Line-by-line explanation**
3. **Key concepts used**
4. **Design patterns identified**
5. **Potential improvements**
6. **Learning resources**

Make it educational and easy to understand.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      explanation: response.content[0].text,
      language,
      level,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AdvancedAIService();