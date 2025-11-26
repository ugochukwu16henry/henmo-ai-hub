const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs').promises;

class IntelligentDebuggingService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeError(errorMessage, stackTrace, code, context = {}) {
    try {
      const analysis = await this.performErrorAnalysis(errorMessage, stackTrace, code, context);
      const rootCause = await this.identifyRootCause(analysis);
      const solutions = await this.generateSolutions(analysis, rootCause);
      
      return {
        error: {
          message: errorMessage,
          type: this.categorizeError(errorMessage),
          severity: this.assessSeverity(errorMessage, stackTrace)
        },
        analysis,
        rootCause,
        solutions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error analysis failed: ${error.message}`);
    }
  }

  async performErrorAnalysis(errorMessage, stackTrace, code, context) {
    const prompt = `Analyze this error in detail:

Error Message: ${errorMessage}

Stack Trace:
${stackTrace}

Code Context:
\`\`\`
${code}
\`\`\`

Additional Context:
${JSON.stringify(context, null, 2)}

Provide detailed analysis including:
1. Error type and category
2. Affected code sections
3. Potential causes
4. Impact assessment
5. Related issues that might occur`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parseAnalysis(response.content[0].text);
  }

  async identifyRootCause(analysis) {
    const prompt = `Based on this error analysis, identify the root cause:

${JSON.stringify(analysis, null, 2)}

Provide:
1. Primary root cause
2. Contributing factors
3. Why this error occurred
4. How to prevent similar errors`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parseRootCause(response.content[0].text);
  }

  async generateSolutions(analysis, rootCause) {
    const prompt = `Generate solutions for this error:

Analysis: ${JSON.stringify(analysis, null, 2)}
Root Cause: ${JSON.stringify(rootCause, null, 2)}

Provide:
1. Immediate fixes (quick solutions)
2. Proper fixes (comprehensive solutions)
3. Prevention strategies
4. Code examples for each solution
5. Testing recommendations`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parseSolutions(response.content[0].text);
  }

  async debugCode(code, language, debugType = 'general') {
    try {
      const issues = await this.findLogicalErrors(code, language);
      const performance = await this.analyzePerformance(code, language);
      const suggestions = await this.generateImprovements(code, language, debugType);
      
      return {
        issues,
        performance,
        suggestions,
        score: this.calculateDebugScore(issues, performance),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Code debugging failed: ${error.message}`);
    }
  }

  async findLogicalErrors(code, language) {
    const prompt = `Find logical errors and potential bugs in this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Look for:
1. Null pointer exceptions
2. Array/buffer overflows
3. Logic errors
4. Race conditions
5. Memory leaks
6. Infinite loops
7. Incorrect algorithms

Provide specific line numbers and explanations.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parseLogicalErrors(response.content[0].text);
  }

  async analyzePerformance(code, language) {
    const prompt = `Analyze performance issues in this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Identify:
1. Time complexity issues
2. Space complexity problems
3. Inefficient algorithms
4. Unnecessary computations
5. I/O bottlenecks
6. Memory usage patterns

Provide optimization suggestions with code examples.`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parsePerformanceAnalysis(response.content[0].text);
  }

  async generateImprovements(code, language, debugType) {
    const prompt = `Suggest improvements for this ${language} code (focus: ${debugType}):

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Code quality improvements
2. Best practice recommendations
3. Refactoring suggestions
4. Error handling improvements
5. Testing strategies
6. Documentation suggestions`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    return this.parseImprovements(response.content[0].text);
  }

  categorizeError(errorMessage) {
    const categories = {
      syntax: ['SyntaxError', 'ParseError', 'IndentationError'],
      runtime: ['RuntimeError', 'TypeError', 'ValueError', 'AttributeError'],
      logic: ['AssertionError', 'IndexError', 'KeyError'],
      network: ['ConnectionError', 'TimeoutError', 'HTTPError'],
      database: ['DatabaseError', 'IntegrityError', 'OperationalError'],
      security: ['PermissionError', 'AuthenticationError', 'ValidationError']
    };

    for (const [category, errors] of Object.entries(categories)) {
      if (errors.some(error => errorMessage.includes(error))) {
        return category;
      }
    }

    return 'unknown';
  }

  assessSeverity(errorMessage, stackTrace) {
    const criticalKeywords = ['crash', 'fatal', 'critical', 'security', 'corruption'];
    const highKeywords = ['error', 'exception', 'failure', 'timeout'];
    const mediumKeywords = ['warning', 'deprecated', 'invalid'];

    const text = (errorMessage + stackTrace).toLowerCase();

    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return 'critical';
    } else if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }

    return 'low';
  }

  parseAnalysis(text) {
    return {
      errorType: this.extractSection(text, 'Error type'),
      affectedSections: this.extractSection(text, 'Affected code'),
      potentialCauses: this.extractSection(text, 'Potential causes'),
      impact: this.extractSection(text, 'Impact'),
      relatedIssues: this.extractSection(text, 'Related issues'),
      rawAnalysis: text
    };
  }

  parseRootCause(text) {
    return {
      primaryCause: this.extractSection(text, 'Primary root cause'),
      contributingFactors: this.extractSection(text, 'Contributing factors'),
      explanation: this.extractSection(text, 'Why this error occurred'),
      prevention: this.extractSection(text, 'How to prevent'),
      rawCause: text
    };
  }

  parseSolutions(text) {
    return {
      immediateFixes: this.extractSection(text, 'Immediate fixes'),
      properFixes: this.extractSection(text, 'Proper fixes'),
      prevention: this.extractSection(text, 'Prevention strategies'),
      codeExamples: this.extractCodeBlocks(text),
      testing: this.extractSection(text, 'Testing recommendations'),
      rawSolutions: text
    };
  }

  parseLogicalErrors(text) {
    const errors = [];
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('Line') && (line.includes('Error') || line.includes('Bug'))) {
        const lineNumber = this.extractLineNumber(line);
        const description = lines[index + 1] || line;
        
        errors.push({
          line: lineNumber,
          type: this.categorizeLogicalError(description),
          description: description.trim(),
          severity: this.assessErrorSeverity(description)
        });
      }
    });
    
    return errors;
  }

  parsePerformanceAnalysis(text) {
    return {
      timeComplexity: this.extractSection(text, 'Time complexity'),
      spaceComplexity: this.extractSection(text, 'Space complexity'),
      bottlenecks: this.extractSection(text, 'bottlenecks'),
      optimizations: this.extractSection(text, 'optimization'),
      score: this.calculatePerformanceScore(text),
      rawAnalysis: text
    };
  }

  parseImprovements(text) {
    return {
      quality: this.extractSection(text, 'quality improvements'),
      bestPractices: this.extractSection(text, 'best practice'),
      refactoring: this.extractSection(text, 'refactoring'),
      errorHandling: this.extractSection(text, 'error handling'),
      testing: this.extractSection(text, 'testing'),
      documentation: this.extractSection(text, 'documentation'),
      rawImprovements: text
    };
  }

  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  extractCodeBlocks(text) {
    const codeBlocks = [];
    const regex = /```[\s\S]*?```/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      codeBlocks.push(match[0]);
    }
    
    return codeBlocks;
  }

  extractLineNumber(text) {
    const match = text.match(/line\s+(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }

  categorizeLogicalError(description) {
    const types = {
      nullPointer: ['null', 'undefined', 'pointer'],
      arrayBounds: ['array', 'index', 'bounds', 'overflow'],
      logic: ['logic', 'algorithm', 'condition'],
      concurrency: ['race', 'thread', 'concurrent', 'deadlock'],
      memory: ['memory', 'leak', 'allocation']
    };

    for (const [type, keywords] of Object.entries(types)) {
      if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
        return type;
      }
    }

    return 'general';
  }

  assessErrorSeverity(description) {
    const critical = ['crash', 'fatal', 'corruption', 'security'];
    const high = ['error', 'exception', 'failure'];
    const medium = ['warning', 'potential'];

    const text = description.toLowerCase();

    if (critical.some(keyword => text.includes(keyword))) return 'critical';
    if (high.some(keyword => text.includes(keyword))) return 'high';
    if (medium.some(keyword => text.includes(keyword))) return 'medium';

    return 'low';
  }

  calculateDebugScore(issues, performance) {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });

    score -= (performance.score || 0) * 0.3;
    
    return Math.max(0, Math.round(score));
  }

  calculatePerformanceScore(text) {
    const inefficiencies = (text.match(/inefficient|slow|bottleneck|optimization/gi) || []).length;
    return Math.max(0, 100 - (inefficiencies * 10));
  }
}

module.exports = IntelligentDebuggingService;