const CodeAnalysisService = require('../services/ai/core/code-analysis.service');
const FileOperationsService = require('../services/ai/tools/file-operations.service');
const IntelligentDebuggingService = require('../services/ai/analysis/intelligent-debugging.service');

class AICapabilitiesController {
  constructor() {
    this.codeAnalysis = new CodeAnalysisService();
    this.fileOps = new FileOperationsService();
    this.debugging = new IntelligentDebuggingService();
  }

  // Code Analysis Endpoints
  async analyzeCode(req, res) {
    try {
      const { code, language, analysisType = 'full' } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
      }

      const result = await this.codeAnalysis.analyzeCode(code, language, analysisType);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async scanDirectory(req, res) {
    try {
      const { directoryPath, options = {} } = req.body;
      
      if (!directoryPath) {
        return res.status(400).json({ error: 'Directory path is required' });
      }

      const result = await this.codeAnalysis.scanDirectory(directoryPath, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // File Operations Endpoints
  async readFile(req, res) {
    try {
      const { filePath } = req.params;
      
      const result = await this.fileOps.readFile(filePath);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async writeFile(req, res) {
    try {
      const { filePath, content, options = {} } = req.body;
      
      if (!filePath || content === undefined) {
        return res.status(400).json({ error: 'File path and content are required' });
      }

      const result = await this.fileOps.writeFile(filePath, content, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createFile(req, res) {
    try {
      const { filePath, content = '', template = null } = req.body;
      
      if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
      }

      const result = await this.fileOps.createFile(filePath, content, template);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteFile(req, res) {
    try {
      const { filePath } = req.params;
      
      const result = await this.fileOps.deleteFile(filePath);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listDirectory(req, res) {
    try {
      const { dirPath } = req.params;
      const options = req.query;
      
      const result = await this.fileOps.listDirectory(dirPath, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchFiles(req, res) {
    try {
      const { searchPath, query, options = {} } = req.body;
      
      if (!searchPath || !query) {
        return res.status(400).json({ error: 'Search path and query are required' });
      }

      const result = await this.fileOps.searchFiles(searchPath, query, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async executeCommand(req, res) {
    try {
      const { command, workingDir } = req.body;
      
      if (!command) {
        return res.status(400).json({ error: 'Command is required' });
      }

      const result = await this.fileOps.executeCommand(command, workingDir);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Debugging Endpoints
  async analyzeError(req, res) {
    try {
      const { errorMessage, stackTrace, code, context = {} } = req.body;
      
      if (!errorMessage) {
        return res.status(400).json({ error: 'Error message is required' });
      }

      const result = await this.debugging.analyzeError(errorMessage, stackTrace, code, context);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async debugCode(req, res) {
    try {
      const { code, language, debugType = 'general' } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
      }

      const result = await this.debugging.debugCode(code, language, debugType);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Multi-language Code Generation
  async generateCode(req, res) {
    try {
      const { prompt, language, framework = null, template = null } = req.body;
      
      if (!prompt || !language) {
        return res.status(400).json({ error: 'Prompt and language are required' });
      }

      // Use existing advanced AI service for code generation
      const result = await this.generateCodeWithAI(prompt, language, framework, template);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateCodeWithAI(prompt, language, framework, template) {
    const codePrompt = `Generate ${language} code${framework ? ` using ${framework}` : ''} for:

${prompt}

Requirements:
1. Production-ready code
2. Best practices and patterns
3. Error handling
4. Comments and documentation
5. Security considerations
${template ? `6. Follow ${template} template structure` : ''}

Provide complete, working code with explanations.`;

    const anthropic = new (require('@anthropic-ai/sdk').Anthropic)({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: codePrompt }]
    });

    return {
      code: this.extractCodeFromResponse(response.content[0].text),
      explanation: response.content[0].text,
      language,
      framework,
      timestamp: new Date().toISOString()
    };
  }

  extractCodeFromResponse(text) {
    const codeBlocks = text.match(/```[\s\S]*?```/g);
    return codeBlocks ? codeBlocks.map(block => block.replace(/```\w*\n?|\n?```/g, '')) : [];
  }

  // Performance Optimization
  async optimizeCode(req, res) {
    try {
      const { code, language, optimizationType = 'performance' } = req.body;
      
      if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
      }

      const analysis = await this.codeAnalysis.analyzeCode(code, language, 'performance');
      const debugging = await this.debugging.debugCode(code, language, 'performance');
      
      const result = {
        originalCode: code,
        analysis: analysis,
        debugging: debugging,
        optimizations: this.generateOptimizations(analysis, debugging),
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  generateOptimizations(analysis, debugging) {
    const optimizations = [];
    
    // Extract optimization suggestions from analysis and debugging results
    if (analysis.recommendations) {
      analysis.recommendations.forEach(rec => {
        if (rec.toLowerCase().includes('performance') || rec.toLowerCase().includes('optimization')) {
          optimizations.push({
            type: 'performance',
            suggestion: rec,
            priority: 'high'
          });
        }
      });
    }
    
    if (debugging.performance) {
      optimizations.push({
        type: 'algorithm',
        suggestion: debugging.performance.optimizations,
        priority: 'medium'
      });
    }
    
    return optimizations;
  }

  // Get AI Capabilities Summary
  async getCapabilities(req, res) {
    try {
      const capabilities = {
        codeAnalysis: {
          supportedLanguages: this.codeAnalysis.supportedLanguages,
          analysisTypes: ['security', 'performance', 'quality', 'bugs', 'full'],
          features: ['SAST scanning', 'secrets detection', 'performance profiling', 'quality assessment']
        },
        fileOperations: {
          operations: ['read', 'write', 'create', 'delete', 'copy', 'move', 'search'],
          supportedExtensions: this.fileOps.allowedExtensions,
          features: ['directory scanning', 'content search', 'command execution', 'backup creation']
        },
        debugging: {
          capabilities: ['error analysis', 'root cause identification', 'solution generation', 'performance analysis'],
          errorTypes: ['syntax', 'runtime', 'logic', 'network', 'database', 'security'],
          features: ['intelligent debugging', 'code optimization', 'best practice recommendations']
        },
        codeGeneration: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php'],
          frameworks: ['react', 'node', 'express', 'django', 'spring', 'gin'],
          templates: ['react', 'node', 'python', 'api', 'database']
        }
      };
      
      res.json({
        success: true,
        data: capabilities
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AICapabilitiesController;