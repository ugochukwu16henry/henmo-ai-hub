const VideoGeneratorService = require('../services/media/video/video-generator.service');
const ImageGeneratorService = require('../services/media/image/image-generator.service');
const path = require('path');
const fs = require('fs').promises;

class MediaController {
  constructor() {
    this.videoGenerator = new VideoGeneratorService();
    this.imageGenerator = new ImageGeneratorService();
  }

  // Video Generation Endpoints
  async generateDemoVideo(req, res) {
    try {
      const { title, duration, scenes, resolution, fps, includeWatermark } = req.body;
      
      const options = {
        title: title || 'HenMo AI Demo',
        duration: duration || 30,
        scenes: scenes || [],
        resolution: resolution || '1920x1080',
        fps: fps || 30,
        includeWatermark: includeWatermark !== false
      };

      const result = await this.videoGenerator.generateDemoVideo(options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateAppShowcase(req, res) {
    try {
      const appData = req.body.appData || {
        name: 'HenMo AI Platform',
        features: [
          'AI Code Analysis & Security Scanning',
          'Multi-Language Support (11+ Languages)',
          'Real-time Debugging & Optimization',
          'Advanced File Operations',
          'Intelligent Error Analysis'
        ],
        statistics: {
          'Lines of Code': '26,000+',
          'Features': '50+',
          'Languages Supported': '11+',
          'Development Time': '8 months'
        }
      };

      const result = await this.videoGenerator.generateAppShowcase(appData);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateVersionDemo(req, res) {
    try {
      const { version, features, improvements, releaseDate } = req.body;
      
      if (!version) {
        return res.status(400).json({ error: 'Version is required' });
      }

      const versionData = {
        version,
        features: features || [
          'Enhanced AI Capabilities',
          'New Code Analysis Features',
          'Improved Performance',
          'Better User Interface'
        ],
        improvements: improvements || [
          'Faster processing speed',
          'Better error detection',
          'Enhanced security scanning',
          'Improved user experience'
        ],
        releaseDate: releaseDate || new Date().toLocaleDateString()
      };

      const result = await this.videoGenerator.generateVersionDemo(versionData);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Image Generation Endpoints
  async generateImage(req, res) {
    try {
      const { prompt, width, height, style, includeWatermark, format } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const options = {
        width: width || 1920,
        height: height || 1080,
        style: style || 'professional',
        includeWatermark: includeWatermark !== false,
        format: format || 'png'
      };

      const result = await this.imageGenerator.generateImage(prompt, options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateCompanyBranding(req, res) {
    try {
      const { type, text, tagline, colorScheme } = req.body;
      
      const options = {
        type: type || 'logo',
        text: text || 'HenMo AI',
        tagline: tagline || 'Advanced AI Development Hub',
        colorScheme: colorScheme || 'blue'
      };

      const result = await this.imageGenerator.generateCompanyBranding(options);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateProductScreenshot(req, res) {
    try {
      const { pageType, data } = req.body;
      
      if (!pageType) {
        return res.status(400).json({ error: 'Page type is required' });
      }

      const validPageTypes = ['dashboard', 'ai-chat', 'code-analysis', 'features'];
      if (!validPageTypes.includes(pageType)) {
        return res.status(400).json({ 
          error: `Invalid page type. Must be one of: ${validPageTypes.join(', ')}` 
        });
      }

      const result = await this.imageGenerator.generateProductScreenshot(pageType, data || {});
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Media Management Endpoints
  async listGeneratedMedia(req, res) {
    try {
      const { type = 'all', limit = 50, offset = 0 } = req.query;
      
      const videoDir = path.join(process.cwd(), 'generated-videos');
      const imageDir = path.join(process.cwd(), 'generated-images');
      
      let files = [];
      
      if (type === 'all' || type === 'video') {
        try {
          const videoFiles = await fs.readdir(videoDir);
          const videoData = await Promise.all(
            videoFiles.map(async (file) => {
              const filePath = path.join(videoDir, file);
              const stats = await fs.stat(filePath);
              return {
                id: path.parse(file).name,
                type: 'video',
                filename: file,
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
              };
            })
          );
          files.push(...videoData);
        } catch (error) {
          // Directory doesn't exist or is empty
        }
      }
      
      if (type === 'all' || type === 'image') {
        try {
          const imageFiles = await fs.readdir(imageDir);
          const imageData = await Promise.all(
            imageFiles.map(async (file) => {
              const filePath = path.join(imageDir, file);
              const stats = await fs.stat(filePath);
              return {
                id: path.parse(file).name,
                type: 'image',
                filename: file,
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
              };
            })
          );
          files.push(...imageData);
        } catch (error) {
          // Directory doesn't exist or is empty
        }
      }
      
      // Sort by creation date (newest first)
      files.sort((a, b) => new Date(b.created) - new Date(a.created));
      
      // Apply pagination
      const paginatedFiles = files.slice(offset, offset + limit);
      
      res.json({
        success: true,
        data: {
          files: paginatedFiles,
          total: files.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async downloadMedia(req, res) {
    try {
      const { mediaId, type } = req.params;
      
      let filePath;
      if (type === 'video') {
        filePath = path.join(process.cwd(), 'generated-videos', `${mediaId}.mp4`);
      } else if (type === 'image') {
        // Try different extensions
        const extensions = ['png', 'jpg', 'jpeg'];
        for (const ext of extensions) {
          const testPath = path.join(process.cwd(), 'generated-images', `${mediaId}.${ext}`);
          try {
            await fs.access(testPath);
            filePath = testPath;
            break;
          } catch {
            continue;
          }
        }
      }
      
      if (!filePath) {
        return res.status(404).json({ error: 'Media file not found' });
      }
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: 'Media file not found' });
      }
      
      // Set appropriate headers
      const filename = path.basename(filePath);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      if (type === 'video') {
        res.setHeader('Content-Type', 'video/mp4');
      } else {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.png') {
          res.setHeader('Content-Type', 'image/png');
        } else if (ext === '.jpg' || ext === '.jpeg') {
          res.setHeader('Content-Type', 'image/jpeg');
        }
      }
      
      // Stream the file
      const fileStream = require('fs').createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteMedia(req, res) {
    try {
      const { mediaId, type } = req.params;
      
      let filePath;
      if (type === 'video') {
        filePath = path.join(process.cwd(), 'generated-videos', `${mediaId}.mp4`);
      } else if (type === 'image') {
        // Try different extensions
        const extensions = ['png', 'jpg', 'jpeg'];
        for (const ext of extensions) {
          const testPath = path.join(process.cwd(), 'generated-images', `${mediaId}.${ext}`);
          try {
            await fs.access(testPath);
            filePath = testPath;
            break;
          } catch {
            continue;
          }
        }
      }
      
      if (!filePath) {
        return res.status(404).json({ error: 'Media file not found' });
      }
      
      await fs.unlink(filePath);
      
      res.json({
        success: true,
        message: 'Media file deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Batch Operations
  async generateBatch(req, res) {
    try {
      const { operations } = req.body;
      
      if (!operations || !Array.isArray(operations)) {
        return res.status(400).json({ error: 'Operations array is required' });
      }
      
      const results = [];
      
      for (const operation of operations) {
        try {
          let result;
          
          switch (operation.type) {
            case 'demo_video':
              result = await this.videoGenerator.generateDemoVideo(operation.options || {});
              break;
            case 'app_showcase':
              result = await this.videoGenerator.generateAppShowcase(operation.data || {});
              break;
            case 'version_demo':
              result = await this.videoGenerator.generateVersionDemo(operation.data || {});
              break;
            case 'image':
              result = await this.imageGenerator.generateImage(operation.prompt, operation.options || {});
              break;
            case 'branding':
              result = await this.imageGenerator.generateCompanyBranding(operation.options || {});
              break;
            case 'screenshot':
              result = await this.imageGenerator.generateProductScreenshot(operation.pageType, operation.data || {});
              break;
            default:
              throw new Error(`Unknown operation type: ${operation.type}`);
          }
          
          results.push({
            operation: operation.type,
            success: true,
            data: result
          });
        } catch (error) {
          results.push({
            operation: operation.type,
            success: false,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        data: {
          results,
          total: operations.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Media Templates
  async getTemplates(req, res) {
    try {
      const templates = {
        video: {
          demo: {
            name: 'Product Demo',
            description: 'Standard product demonstration video',
            duration: 30,
            scenes: ['title', 'features', 'dashboard', 'cta']
          },
          showcase: {
            name: 'App Showcase',
            description: 'Comprehensive application showcase',
            duration: 60,
            scenes: ['title', 'features', 'statistics', 'demo_screens', 'cta']
          },
          version: {
            name: 'Version Release',
            description: 'New version announcement video',
            duration: 45,
            scenes: ['version_title', 'new_features', 'improvements', 'demo_screens']
          }
        },
        image: {
          logo: {
            name: 'Company Logo',
            description: 'Professional company logo design',
            dimensions: '1200x800',
            formats: ['png', 'svg']
          },
          banner: {
            name: 'Marketing Banner',
            description: 'Social media and web banners',
            dimensions: '1920x1080',
            formats: ['png', 'jpg']
          },
          screenshot: {
            name: 'Product Screenshot',
            description: 'Application interface screenshots',
            dimensions: '1920x1080',
            formats: ['png']
          }
        }
      };
      
      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MediaController;