const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');
const { createCanvas, loadImage } = require('canvas');

class VideoGeneratorService {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'generated-videos');
    this.tempDir = path.join(process.cwd(), 'temp-frames');
    this.watermarkPath = path.join(process.cwd(), 'assets', 'henmo-watermark.png');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  }

  async generateDemoVideo(options = {}) {
    const {
      title = 'HenMo AI Demo',
      duration = 30,
      scenes = [],
      resolution = '1920x1080',
      fps = 30,
      includeWatermark = true
    } = options;

    try {
      const videoId = `demo_${Date.now()}`;
      const outputPath = path.join(this.outputDir, `${videoId}.mp4`);

      // Generate scenes
      const framesPaths = await this.generateScenes(scenes, videoId);
      
      // Create video from frames
      const videoPath = await this.createVideoFromFrames(framesPaths, {
        outputPath,
        fps,
        resolution,
        includeWatermark
      });

      // Cleanup temp files
      await this.cleanupTempFiles(framesPaths);

      return {
        videoId,
        path: videoPath,
        duration,
        resolution,
        size: await this.getFileSize(videoPath),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Demo video generation failed: ${error.message}`);
    }
  }

  async generateAppShowcase(appData) {
    const scenes = [
      {
        type: 'title',
        content: {
          title: 'HenMo AI Platform',
          subtitle: 'Advanced AI Development Hub',
          duration: 3
        }
      },
      {
        type: 'features',
        content: {
          title: 'Core Features',
          features: [
            'AI Code Analysis & Security Scanning',
            'Multi-Language Support (11+ Languages)',
            'Real-time Debugging & Optimization',
            'Advanced File Operations',
            'Intelligent Error Analysis'
          ],
          duration: 5
        }
      },
      {
        type: 'dashboard',
        content: {
          title: 'Professional Dashboard',
          description: 'Comprehensive development environment',
          duration: 4
        }
      },
      {
        type: 'statistics',
        content: {
          title: 'Platform Statistics',
          stats: {
            'Lines of Code': '26,000+',
            'Features': '50+',
            'Languages Supported': '11+',
            'Development Time': '8 months'
          },
          duration: 4
        }
      },
      {
        type: 'cta',
        content: {
          title: 'Start Building with HenMo AI',
          subtitle: 'Experience the future of AI development',
          duration: 3
        }
      }
    ];

    return await this.generateDemoVideo({
      title: 'HenMo AI Platform Showcase',
      duration: 19,
      scenes
    });
  }

  async generateVersionDemo(versionData) {
    const { version, features, improvements, releaseDate } = versionData;
    
    const scenes = [
      {
        type: 'version_title',
        content: {
          title: `HenMo AI v${version}`,
          subtitle: `Released ${releaseDate}`,
          duration: 3
        }
      },
      {
        type: 'new_features',
        content: {
          title: 'New Features',
          features: features || [],
          duration: 6
        }
      },
      {
        type: 'improvements',
        content: {
          title: 'Improvements',
          improvements: improvements || [],
          duration: 4
        }
      },
      {
        type: 'demo_screens',
        content: {
          title: 'Live Demo',
          screens: ['dashboard', 'ai-tools', 'code-analysis'],
          duration: 8
        }
      }
    ];

    return await this.generateDemoVideo({
      title: `HenMo AI v${version} Demo`,
      duration: 21,
      scenes
    });
  }

  async generateScenes(scenes, videoId) {
    const framesPaths = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const scenePaths = await this.generateSceneFrames(scene, i, videoId);
      framesPaths.push(...scenePaths);
    }
    
    return framesPaths;
  }

  async generateSceneFrames(scene, sceneIndex, videoId) {
    const { type, content } = scene;
    const framesPaths = [];
    const framesCount = (content.duration || 3) * 30; // 30 FPS

    for (let frame = 0; frame < framesCount; frame++) {
      const framePath = path.join(this.tempDir, `${videoId}_scene${sceneIndex}_frame${frame}.png`);
      
      await this.generateFrame(type, content, frame, framesCount, framePath);
      framesPaths.push(framePath);
    }
    
    return framesPaths;
  }

  async generateFrame(sceneType, content, frameIndex, totalFrames, outputPath) {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#3730a3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);

    // Animation progress
    const progress = frameIndex / totalFrames;
    
    switch (sceneType) {
      case 'title':
        await this.drawTitleScene(ctx, content, progress);
        break;
      case 'features':
        await this.drawFeaturesScene(ctx, content, progress);
        break;
      case 'dashboard':
        await this.drawDashboardScene(ctx, content, progress);
        break;
      case 'statistics':
        await this.drawStatisticsScene(ctx, content, progress);
        break;
      case 'cta':
        await this.drawCTAScene(ctx, content, progress);
        break;
      case 'version_title':
        await this.drawVersionTitleScene(ctx, content, progress);
        break;
      case 'new_features':
        await this.drawNewFeaturesScene(ctx, content, progress);
        break;
      case 'improvements':
        await this.drawImprovementsScene(ctx, content, progress);
        break;
      case 'demo_screens':
        await this.drawDemoScreensScene(ctx, content, progress);
        break;
    }

    // Add watermark
    await this.addWatermark(ctx);
    
    // Save frame
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);
  }

  async drawTitleScene(ctx, content, progress) {
    const { title, subtitle } = content;
    
    // Fade in animation
    const alpha = Math.min(progress * 2, 1);
    ctx.globalAlpha = alpha;
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 400);
    
    // Subtitle
    ctx.font = '60px Arial';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(subtitle, 960, 500);
    
    // Logo placeholder
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(860, 600, 200, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.fillText('HenMo AI', 960, 660);
    
    ctx.globalAlpha = 1;
  }

  async drawFeaturesScene(ctx, content, progress) {
    const { title, features } = content;
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 150);
    
    // Features list with animation
    ctx.font = '50px Arial';
    ctx.textAlign = 'left';
    
    features.forEach((feature, index) => {
      const featureProgress = Math.max(0, (progress * features.length) - index);
      const alpha = Math.min(featureProgress, 1);
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#e5e7eb';
      
      // Bullet point
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(200, 280 + (index * 100), 20, 20);
      
      // Feature text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(feature, 250, 305 + (index * 100));
    });
    
    ctx.globalAlpha = 1;
  }

  async drawStatisticsScene(ctx, content, progress) {
    const { title, stats } = content;
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 150);
    
    // Stats grid
    const statsArray = Object.entries(stats);
    const cols = 2;
    const rows = Math.ceil(statsArray.length / cols);
    
    statsArray.forEach(([key, value], index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = 300 + (col * 600);
      const y = 300 + (row * 200);
      
      const statProgress = Math.max(0, (progress * statsArray.length) - index);
      const alpha = Math.min(statProgress, 1);
      
      ctx.globalAlpha = alpha;
      
      // Stat box
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(x - 150, y - 50, 300, 120);
      
      // Value
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value, x, y);
      
      // Label
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '30px Arial';
      ctx.fillText(key, x, y + 40);
    });
    
    ctx.globalAlpha = 1;
  }

  async drawCTAScene(ctx, content, progress) {
    const { title, subtitle } = content;
    
    // Pulsing animation
    const pulse = 0.9 + (Math.sin(progress * Math.PI * 4) * 0.1);
    
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.translate((1920 * (1 - pulse)) / 2, (1080 * (1 - pulse)) / 2);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 400);
    
    // Subtitle
    ctx.font = '50px Arial';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(subtitle, 960, 480);
    
    // Button
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(760, 520, 400, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('Get Started', 960, 570);
    
    ctx.restore();
  }

  async addWatermark(ctx) {
    try {
      // Simple text watermark if image not available
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('© HenMo AI 2025', 1850, 1050);
      ctx.restore();
    } catch (error) {
      console.error('Watermark error:', error);
    }
  }

  async createVideoFromFrames(framesPaths, options) {
    const { outputPath, fps, resolution, includeWatermark } = options;
    
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(path.join(this.tempDir, '*.png'))
        .inputOptions(['-pattern_type glob', `-framerate ${fps}`])
        .videoCodec('libx264')
        .size(resolution)
        .fps(fps)
        .outputOptions([
          '-pix_fmt yuv420p',
          '-crf 23',
          '-preset medium'
        ]);
      
      if (includeWatermark) {
        command.complexFilter([
          '[0:v]drawtext=text=\'© HenMo AI 2025\':fontcolor=white:fontsize=30:x=w-tw-20:y=h-th-20:alpha=0.7[v]'
        ], ['v']);
      }
      
      command
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }

  async cleanupTempFiles(framesPaths) {
    try {
      for (const framePath of framesPaths) {
        await fs.unlink(framePath).catch(() => {});
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  // Additional scene drawing methods
  async drawVersionTitleScene(ctx, content, progress) {
    const { title, subtitle } = content;
    
    // Slide in animation
    const slideX = 1920 - (1920 * Math.min(progress * 1.5, 1));
    
    ctx.save();
    ctx.translate(slideX, 0);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 400);
    
    ctx.font = '60px Arial';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(subtitle, 960, 500);
    
    ctx.restore();
  }

  async drawNewFeaturesScene(ctx, content, progress) {
    await this.drawFeaturesScene(ctx, content, progress);
  }

  async drawImprovementsScene(ctx, content, progress) {
    const { title, improvements } = content;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 150);
    
    ctx.font = '45px Arial';
    ctx.textAlign = 'left';
    
    improvements.forEach((improvement, index) => {
      const itemProgress = Math.max(0, (progress * improvements.length) - index);
      const alpha = Math.min(itemProgress, 1);
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(200, 280 + (index * 80), 15, 15);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(improvement, 240, 300 + (index * 80));
    });
    
    ctx.globalAlpha = 1;
  }

  async drawDashboardScene(ctx, content, progress) {
    const { title, description } = content;
    
    // Mock dashboard elements
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 150);
    
    ctx.font = '50px Arial';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(description, 960, 220);
    
    // Dashboard mockup
    const dashProgress = Math.min(progress * 2, 1);
    ctx.globalAlpha = dashProgress;
    
    // Sidebar
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(100, 300, 300, 600);
    
    // Main content
    ctx.fillStyle = '#374151';
    ctx.fillRect(450, 300, 1300, 600);
    
    // Cards
    for (let i = 0; i < 6; i++) {
      const cardX = 500 + (i % 3) * 400;
      const cardY = 350 + Math.floor(i / 3) * 250;
      
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(cardX, cardY, 350, 200);
    }
    
    ctx.globalAlpha = 1;
  }

  async drawDemoScreensScene(ctx, content, progress) {
    const { title, screens } = content;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 960, 150);
    
    // Rotating screens
    const currentScreen = Math.floor(progress * screens.length) % screens.length;
    const screenProgress = (progress * screens.length) % 1;
    
    ctx.save();
    ctx.translate(960, 540);
    ctx.rotate(screenProgress * 0.1);
    
    // Screen mockup
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-600, -300, 1200, 600);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(screens[currentScreen].toUpperCase(), 0, 0);
    
    ctx.restore();
  }
}

module.exports = VideoGeneratorService;