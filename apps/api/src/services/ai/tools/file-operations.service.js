const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class FileOperationsService {
  constructor() {
    this.allowedExtensions = ['.js', '.ts', '.py', '.java', '.cs', '.go', '.rs', '.php', '.sql', '.cpp', '.c', '.jsx', '.tsx', '.json', '.md', '.txt'];
    this.restrictedPaths = ['node_modules', '.git', 'dist', 'build'];
  }

  async readFile(filePath) {
    try {
      this.validatePath(filePath);
      const content = await fs.readFile(filePath, 'utf8');
      const stats = await fs.stat(filePath);
      
      return {
        content,
        size: stats.size,
        modified: stats.mtime,
        extension: path.extname(filePath),
        language: this.detectLanguage(filePath)
      };
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  async writeFile(filePath, content, options = {}) {
    try {
      this.validatePath(filePath);
      this.validateContent(content);
      
      const { backup = true, createDir = true } = options;
      
      if (createDir) {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
      }
      
      if (backup && await this.fileExists(filePath)) {
        await this.createBackup(filePath);
      }
      
      await fs.writeFile(filePath, content, 'utf8');
      
      return {
        success: true,
        path: filePath,
        size: Buffer.byteLength(content, 'utf8'),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }

  async createFile(filePath, content = '', template = null) {
    try {
      if (await this.fileExists(filePath)) {
        throw new Error('File already exists');
      }
      
      let fileContent = content;
      if (template) {
        fileContent = this.applyTemplate(template, filePath);
      }
      
      return await this.writeFile(filePath, fileContent, { backup: false });
    } catch (error) {
      throw new Error(`Failed to create file: ${error.message}`);
    }
  }

  async deleteFile(filePath) {
    try {
      this.validatePath(filePath);
      await this.createBackup(filePath);
      await fs.unlink(filePath);
      
      return {
        success: true,
        path: filePath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async copyFile(sourcePath, destPath) {
    try {
      this.validatePath(sourcePath);
      this.validatePath(destPath);
      
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(sourcePath, destPath);
      
      return {
        success: true,
        source: sourcePath,
        destination: destPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  async moveFile(sourcePath, destPath) {
    try {
      await this.copyFile(sourcePath, destPath);
      await fs.unlink(sourcePath);
      
      return {
        success: true,
        source: sourcePath,
        destination: destPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  async listDirectory(dirPath, options = {}) {
    try {
      this.validatePath(dirPath);
      const { recursive = false, includeHidden = false, filter = null } = options;
      
      const items = await this.scanDirectory(dirPath, recursive, includeHidden);
      
      if (filter) {
        return items.filter(item => this.matchesFilter(item, filter));
      }
      
      return items;
    } catch (error) {
      throw new Error(`Failed to list directory: ${error.message}`);
    }
  }

  async createDirectory(dirPath) {
    try {
      this.validatePath(dirPath);
      await fs.mkdir(dirPath, { recursive: true });
      
      return {
        success: true,
        path: dirPath,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }

  async searchFiles(searchPath, query, options = {}) {
    try {
      const { 
        caseSensitive = false, 
        regex = false, 
        fileContent = false,
        extensions = this.allowedExtensions 
      } = options;
      
      const files = await this.scanDirectory(searchPath, true, false);
      const results = [];
      
      for (const file of files) {
        if (!file.isFile) continue;
        
        const ext = path.extname(file.path);
        if (!extensions.includes(ext)) continue;
        
        let matches = [];
        
        // Search filename
        if (this.matchesQuery(file.name, query, caseSensitive, regex)) {
          matches.push({ type: 'filename', line: 0, text: file.name });
        }
        
        // Search file content
        if (fileContent) {
          const content = await fs.readFile(file.path, 'utf8');
          const contentMatches = this.searchInContent(content, query, caseSensitive, regex);
          matches.push(...contentMatches);
        }
        
        if (matches.length > 0) {
          results.push({
            file: file.path,
            matches,
            language: this.detectLanguage(file.path)
          });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async executeCommand(command, workingDir = process.cwd()) {
    try {
      this.validateCommand(command);
      
      const { stdout, stderr } = await execAsync(command, { 
        cwd: workingDir,
        timeout: 30000 // 30 second timeout
      });
      
      return {
        success: true,
        stdout,
        stderr,
        command,
        workingDir,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
  }

  // Helper methods
  validatePath(filePath) {
    const normalizedPath = path.normalize(filePath);
    
    if (this.restrictedPaths.some(restricted => normalizedPath.includes(restricted))) {
      throw new Error('Access to restricted path denied');
    }
    
    if (normalizedPath.includes('..')) {
      throw new Error('Path traversal not allowed');
    }
  }

  validateContent(content) {
    if (typeof content !== 'string') {
      throw new Error('Content must be a string');
    }
    
    if (content.length > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Content size exceeds limit');
    }
  }

  validateCommand(command) {
    const dangerousCommands = ['rm -rf', 'del /f', 'format', 'shutdown', 'reboot'];
    
    if (dangerousCommands.some(dangerous => command.toLowerCase().includes(dangerous))) {
      throw new Error('Dangerous command not allowed');
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createBackup(filePath) {
    if (await this.fileExists(filePath)) {
      const backupPath = `${filePath}.backup.${Date.now()}`;
      await fs.copyFile(filePath, backupPath);
      return backupPath;
    }
  }

  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
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

  applyTemplate(template, filePath) {
    const templates = {
      react: `import React from 'react';\n\nconst ${path.basename(filePath, '.tsx')} = () => {\n  return (\n    <div>\n      {/* Component content */}\n    </div>\n  );\n};\n\nexport default ${path.basename(filePath, '.tsx')};`,
      node: `const express = require('express');\n\nconst ${path.basename(filePath, '.js')} = () => {\n  // Function implementation\n};\n\nmodule.exports = ${path.basename(filePath, '.js')};`,
      python: `#!/usr/bin/env python3\n\ndef main():\n    \"\"\"Main function\"\"\"\n    pass\n\nif __name__ == '__main__':\n    main()`
    };
    
    return templates[template] || '';
  }

  async scanDirectory(dirPath, recursive, includeHidden) {
    const items = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!includeHidden && entry.name.startsWith('.')) continue;
      
      const fullPath = path.join(dirPath, entry.name);
      const stats = await fs.stat(fullPath);
      
      const item = {
        name: entry.name,
        path: fullPath,
        isFile: entry.isFile(),
        isDirectory: entry.isDirectory(),
        size: stats.size,
        modified: stats.mtime
      };
      
      items.push(item);
      
      if (recursive && entry.isDirectory()) {
        const subItems = await this.scanDirectory(fullPath, recursive, includeHidden);
        items.push(...subItems);
      }
    }
    
    return items;
  }

  matchesFilter(item, filter) {
    const { extensions, namePattern, sizeMin, sizeMax } = filter;
    
    if (extensions && !extensions.includes(path.extname(item.name))) {
      return false;
    }
    
    if (namePattern && !item.name.match(new RegExp(namePattern, 'i'))) {
      return false;
    }
    
    if (sizeMin && item.size < sizeMin) return false;
    if (sizeMax && item.size > sizeMax) return false;
    
    return true;
  }

  matchesQuery(text, query, caseSensitive, regex) {
    if (regex) {
      const flags = caseSensitive ? 'g' : 'gi';
      return new RegExp(query, flags).test(text);
    }
    
    const searchText = caseSensitive ? text : text.toLowerCase();
    const searchQuery = caseSensitive ? query : query.toLowerCase();
    
    return searchText.includes(searchQuery);
  }

  searchInContent(content, query, caseSensitive, regex) {
    const matches = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (this.matchesQuery(line, query, caseSensitive, regex)) {
        matches.push({
          type: 'content',
          line: index + 1,
          text: line.trim()
        });
      }
    });
    
    return matches;
  }
}

module.exports = FileOperationsService;