const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

class CodeAnalysisService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'sql', 'cpp', 'c'];
  }

  async analyzeCode(code, language, analysisType = 'full') {
    const prompt = this.buildAnalysisPrompt(code, language, analysisType);
    
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return this.parseAnalysisResult(response.content[0].text, analysisType);
    } catch (error) {
      throw new Error(`Code analysis failed: ${error.message}`);
    }
  }

  buildAnalysisPrompt(code, language, analysisType) {
    const basePrompt = `Analyze this ${language} code for:`;
    
    const analysisTypes = {
      security: 'Security vulnerabilities (SQL injection, XSS, authentication flaws, secrets)',
      performance: 'Performance issues (bottlenecks, inefficient algorithms, memory leaks)',
      quality: 'Code quality (maintainability, readability, best practices)',
      bugs: 'Potential bugs and logical errors',
      full: 'Security, performance, quality, and potential bugs'
    };

    return `${basePrompt} ${analysisTypes[analysisType]}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide structured analysis with:
1. Issues found (severity: critical/high/medium/low)
2. Specific line numbers
3. Recommendations
4. Code examples for fixes`;
  }

  parseAnalysisResult(result, analysisType) {
    return {
      analysisType,
      timestamp: new Date().toISOString(),
      issues: this.extractIssues(result),
      recommendations: this.extractRecommendations(result),
      score: this.calculateQualityScore(result),
      rawResult: result
    };
  }

  extractIssues(result) {
    const issues = [];
    const lines = result.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('CRITICAL:') || line.includes('HIGH:') || line.includes('MEDIUM:') || line.includes('LOW:')) {
        const severity = line.match(/(CRITICAL|HIGH|MEDIUM|LOW):/)?.[1]?.toLowerCase() || 'low';
        const description = line.replace(/^.*?:/, '').trim();
        
        issues.push({
          severity,
          description,
          line: this.extractLineNumber(line),
          type: this.categorizeIssue(description)
        });
      }
    });
    
    return issues;
  }

  extractRecommendations(result) {
    const recommendations = [];
    const sections = result.split(/\d+\./);
    
    sections.forEach(section => {
      if (section.includes('Recommendation') || section.includes('Fix')) {
        recommendations.push(section.trim());
      }
    });
    
    return recommendations;
  }

  calculateQualityScore(result) {
    const criticalCount = (result.match(/CRITICAL:/g) || []).length;
    const highCount = (result.match(/HIGH:/g) || []).length;
    const mediumCount = (result.match(/MEDIUM:/g) || []).length;
    
    let score = 100;
    score -= criticalCount * 25;
    score -= highCount * 15;
    score -= mediumCount * 5;
    
    return Math.max(0, score);
  }

  extractLineNumber(text) {
    const match = text.match(/line\s+(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }

  categorizeIssue(description) {
    const categories = {
      security: ['injection', 'xss', 'auth', 'secret', 'vulnerability'],
      performance: ['slow', 'memory', 'bottleneck', 'inefficient', 'optimization'],
      quality: ['maintainability', 'readability', 'best practice', 'naming'],
      bug: ['error', 'exception', 'null', 'undefined', 'logic']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  async scanDirectory(directoryPath, options = {}) {
    const { recursive = true, excludePatterns = ['node_modules', '.git', 'dist'] } = options;
    const results = [];

    try {
      const files = await this.getCodeFiles(directoryPath, recursive, excludePatterns);
      
      for (const file of files) {
        const code = await fs.readFile(file, 'utf8');
        const language = this.detectLanguage(file);
        
        if (this.supportedLanguages.includes(language)) {
          const analysis = await this.analyzeCode(code, language);
          results.push({
            file,
            language,
            analysis
          });
        }
      }
      
      return {
        summary: this.generateSummary(results),
        files: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Directory scan failed: ${error.message}`);
    }
  }

  async getCodeFiles(dir, recursive, excludePatterns) {
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (excludePatterns.some(pattern => item.name.includes(pattern))) {
        continue;
      }

      if (item.isDirectory() && recursive) {
        files.push(...await this.getCodeFiles(fullPath, recursive, excludePatterns));
      } else if (item.isFile() && this.isCodeFile(item.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  isCodeFile(filename) {
    const extensions = ['.js', '.ts', '.py', '.java', '.cs', '.go', '.rs', '.php', '.sql', '.cpp', '.c', '.jsx', '.tsx'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  detectLanguage(filename) {
    const ext = path.extname(filename).toLowerCase();
    const langMap = {
      '.js': 'javascript', '.jsx': 'javascript',
      '.ts': 'typescript', '.tsx': 'typescript',
      '.py': 'python', '.java': 'java',
      '.cs': 'csharp', '.go': 'go',
      '.rs': 'rust', '.php': 'php',
      '.sql': 'sql', '.cpp': 'cpp', '.c': 'c'
    };
    return langMap[ext] || 'text';
  }

  generateSummary(results) {
    const totalFiles = results.length;
    const totalIssues = results.reduce((sum, r) => sum + r.analysis.issues.length, 0);
    const avgScore = results.reduce((sum, r) => sum + r.analysis.score, 0) / totalFiles;
    
    const severityCounts = results.reduce((counts, r) => {
      r.analysis.issues.forEach(issue => {
        counts[issue.severity] = (counts[issue.severity] || 0) + 1;
      });
      return counts;
    }, {});

    return {
      totalFiles,
      totalIssues,
      averageScore: Math.round(avgScore),
      severityBreakdown: severityCounts,
      languages: [...new Set(results.map(r => r.language))]
    };
  }
}

module.exports = CodeAnalysisService;