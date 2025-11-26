const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs').promises;
const path = require('path');
const { Anthropic } = require('@anthropic-ai/sdk');

class ImageGeneratorService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.outputDir = path.join(process.cwd(), 'generated-images');
    this.watermarkPath = path.join(process.cwd(), 'assets', 'henmo-watermark.png');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(path.join(process.cwd(), 'assets'), { recursive: true });
    } catch (error) {
      console.error('Failed to create directories:', error);
    }
  }

  async generateImage(prompt, options = {}) {
    const {
      width = 1920,
      height = 1080,
      style = 'professional',
      includeWatermark = true,
      format = 'png'
    } = options;

    try {
      const imageId = `img_${Date.now()}`;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Generate base image based on prompt
      await this.drawGeneratedContent(ctx, prompt, style, width, height);

      // Add watermark
      if (includeWatermark) {
        await this.addWatermark(ctx, width, height);
      }

      // Save image
      const outputPath = path.join(this.outputDir, `${imageId}.${format}`);
      const buffer = canvas.toBuffer(`image/${format}`);
      await fs.writeFile(outputPath, buffer);

      return {
        imageId,
        path: outputPath,
        width,
        height,
        format,
        size: buffer.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  async generateCompanyBranding(options = {}) {
    const {
      type = 'logo',
      text = 'HenMo AI',
      tagline = 'Advanced AI Development Hub',
      colorScheme = 'blue'
    } = options;

    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    switch (type) {
      case 'logo':
        await this.drawLogo(ctx, text, colorScheme);
        break;
      case 'banner':
        await this.drawBanner(ctx, text, tagline, colorScheme);
        break;
      case 'social':
        await this.drawSocialMedia(ctx, text, tagline, colorScheme);
        break;
      case 'presentation':
        await this.drawPresentation(ctx, text, tagline, colorScheme);
        break;
    }

    await this.addWatermark(ctx, 1200, 800);

    const imageId = `branding_${type}_${Date.now()}`;
    const outputPath = path.join(this.outputDir, `${imageId}.png`);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);

    return {
      imageId,
      path: outputPath,
      type,
      width: 1200,
      height: 800,
      size: buffer.length,
      timestamp: new Date().toISOString()
    };
  }

  async generateProductScreenshot(pageType, data = {}) {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);

    switch (pageType) {
      case 'dashboard':
        await this.drawDashboardMockup(ctx, data);
        break;
      case 'ai-chat':
        await this.drawChatMockup(ctx, data);
        break;
      case 'code-analysis':
        await this.drawCodeAnalysisMockup(ctx, data);
        break;
      case 'features':
        await this.drawFeaturesMockup(ctx, data);
        break;
    }

    await this.addWatermark(ctx, 1920, 1080);

    const imageId = `screenshot_${pageType}_${Date.now()}`;
    const outputPath = path.join(this.outputDir, `${imageId}.png`);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);

    return {
      imageId,
      path: outputPath,
      pageType,
      width: 1920,
      height: 1080,
      size: buffer.length,
      timestamp: new Date().toISOString()
    };
  }

  async drawGeneratedContent(ctx, prompt, style, width, height) {
    // Create AI-inspired background based on prompt
    const colors = this.getStyleColors(style);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.accent);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add geometric patterns
    await this.drawGeometricPattern(ctx, width, height, colors);

    // Add text content based on prompt
    await this.drawPromptContent(ctx, prompt, width, height, colors);
  }

  async drawLogo(ctx, text, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    
    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, 1200, 800);

    // Logo circle
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(600, 300, 120, 0, Math.PI * 2);
    ctx.fill();

    // Logo text inside circle
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('H', 580, 320);
    ctx.fillText('A', 620, 320);

    // Company name
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 80px Arial';
    ctx.fillText(text, 600, 500);

    // Accent line
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(400, 550);
    ctx.lineTo(800, 550);
    ctx.stroke();
  }

  async drawBanner(ctx, text, tagline, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Main title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 600, 300);

    // Tagline
    ctx.font = '50px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(tagline, 600, 380);

    // Decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1200;
      const y = Math.random() * 800;
      const size = Math.random() * 20 + 5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  async drawSocialMedia(ctx, text, tagline, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    
    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, 1200, 800);

    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.fillRect(100, 150, 1000, 500);
    ctx.shadowBlur = 0;

    // Logo area
    ctx.fillStyle = colors.primary;
    ctx.fillRect(150, 200, 100, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HA', 200, 260);

    // Text content
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(text, 300, 260);

    ctx.font = '30px Arial';
    ctx.fillStyle = colors.secondary;
    ctx.fillText(tagline, 300, 300);

    // Stats
    const stats = ['26K+ Lines', '50+ Features', '11+ Languages'];
    stats.forEach((stat, index) => {
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 25px Arial';
      ctx.fillText(stat, 300 + (index * 200), 400);
    });
  }

  async drawPresentation(ctx, text, tagline, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    
    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, 1200, 800);

    // Header
    ctx.fillStyle = colors.primary;
    ctx.fillRect(0, 0, 1200, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 600, 90);

    // Content area
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 40px Arial';
    ctx.fillText(tagline, 600, 250);

    // Feature boxes
    const features = ['AI Analysis', 'Code Generation', 'Real-time Debug'];
    features.forEach((feature, index) => {
      const x = 150 + (index * 300);
      const y = 350;
      
      ctx.fillStyle = colors.accent;
      ctx.fillRect(x, y, 250, 150);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 25px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(feature, x + 125, y + 80);
    });
  }

  async drawDashboardMockup(ctx, data) {
    // Header
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, 1920, 80);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('HenMo AI Dashboard', 50, 50);

    // Sidebar
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 80, 300, 1000);

    // Navigation items
    const navItems = ['Dashboard', 'AI Chat', 'AI Tools', 'Memory', 'Analytics'];
    navItems.forEach((item, index) => {
      ctx.fillStyle = index === 0 ? '#3b82f6' : 'transparent';
      ctx.fillRect(20, 120 + (index * 60), 260, 50);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText(item, 40, 150 + (index * 60));
    });

    // Main content
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(300, 80, 1620, 1000);

    // Cards
    const cards = [
      { title: 'Code Analysis', value: '1,234', color: '#3b82f6' },
      { title: 'Files Processed', value: '5,678', color: '#10b981' },
      { title: 'Bugs Fixed', value: '234', color: '#f59e0b' },
      { title: 'Performance', value: '98%', color: '#ef4444' }
    ];

    cards.forEach((card, index) => {
      const x = 350 + (index % 2) * 400;
      const y = 150 + Math.floor(index / 2) * 200;
      
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y, 350, 150);
      
      ctx.fillStyle = card.color;
      ctx.fillRect(x, y, 350, 10);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(card.value, x + 175, y + 70);
      
      ctx.font = '20px Arial';
      ctx.fillText(card.title, x + 175, y + 100);
    });
  }

  async drawChatMockup(ctx, data) {
    // Chat header
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, 1920, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AI Chat Assistant', 960, 60);

    // Chat messages
    const messages = [
      { type: 'user', text: 'Analyze this JavaScript code for security issues' },
      { type: 'ai', text: 'I found 3 security vulnerabilities in your code...' },
      { type: 'user', text: 'Can you fix them automatically?' },
      { type: 'ai', text: 'Yes! Here are the fixes with explanations...' }
    ];

    messages.forEach((msg, index) => {
      const y = 150 + (index * 120);
      const isUser = msg.type === 'user';
      
      ctx.fillStyle = isUser ? '#e5e7eb' : '#3b82f6';
      ctx.fillRect(isUser ? 1200 : 200, y, 600, 80);
      
      ctx.fillStyle = isUser ? '#1f2937' : '#ffffff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(msg.text.substring(0, 50) + '...', isUser ? 1220 : 220, y + 30);
    });
  }

  async drawCodeAnalysisMockup(ctx, data) {
    // Header
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, 1920, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Code Analysis Results', 960, 60);

    // Code editor mockup
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(50, 150, 900, 600);
    
    // Line numbers
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(50, 150, 60, 600);
    
    // Code lines
    const codeLines = [
      'function authenticate(user) {',
      '  if (user.password === input) {',
      '    return true;',
      '  }',
      '  return false;',
      '}'
    ];
    
    codeLines.forEach((line, index) => {
      ctx.fillStyle = '#a0aec0';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText((index + 1).toString(), 60, 180 + (index * 30));
      
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(line, 120, 180 + (index * 30));
    });

    // Analysis panel
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(1000, 150, 850, 600);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('Security Issues Found', 1020, 190);
    
    // Issues list
    const issues = [
      { severity: 'HIGH', text: 'Plain text password comparison' },
      { severity: 'MEDIUM', text: 'Missing input validation' },
      { severity: 'LOW', text: 'No rate limiting' }
    ];
    
    issues.forEach((issue, index) => {
      const y = 240 + (index * 80);
      const color = issue.severity === 'HIGH' ? '#ef4444' : 
                   issue.severity === 'MEDIUM' ? '#f59e0b' : '#10b981';
      
      ctx.fillStyle = color;
      ctx.fillRect(1020, y, 100, 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(issue.severity, 1070, y + 20);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(issue.text, 1140, y + 20);
    });
  }

  async drawFeaturesMockup(ctx, data) {
    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HenMo AI Features', 960, 100);

    // Feature grid
    const features = [
      { icon: '🔍', title: 'Code Analysis', desc: 'Advanced security scanning' },
      { icon: '🚀', title: 'Performance', desc: 'Optimization suggestions' },
      { icon: '🛡️', title: 'Security', desc: 'Vulnerability detection' },
      { icon: '🤖', title: 'AI Assistant', desc: 'Intelligent debugging' },
      { icon: '📊', title: 'Analytics', desc: 'Comprehensive reporting' },
      { icon: '⚡', title: 'Real-time', desc: 'Instant feedback' }
    ];

    features.forEach((feature, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 200 + (col * 500);
      const y = 200 + (row * 300);

      // Feature card
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, 400, 250);
      ctx.shadowBlur = 0;

      // Icon
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(feature.icon, x + 200, y + 100);

      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 30px Arial';
      ctx.fillText(feature.title, x + 200, y + 150);

      // Description
      ctx.font = '18px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(feature.desc, x + 200, y + 180);
    });
  }

  async addWatermark(ctx, width, height) {
    try {
      // Company watermark
      ctx.save();
      ctx.globalAlpha = 0.8;
      
      // Watermark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(width - 250, height - 60, 240, 50);
      
      // Watermark text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('© HenMo AI 2025', width - 240, height - 30);
      
      // Logo placeholder
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(width - 280, height - 50, 25, 25);
      
      ctx.restore();
    } catch (error) {
      console.error('Watermark error:', error);
    }
  }

  getStyleColors(style) {
    const styles = {
      professional: {
        primary: '#1e3a8a',
        secondary: '#3730a3',
        accent: '#3b82f6',
        text: '#ffffff'
      },
      modern: {
        primary: '#0f172a',
        secondary: '#1e293b',
        accent: '#06b6d4',
        text: '#ffffff'
      },
      vibrant: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#ec4899',
        text: '#ffffff'
      }
    };
    
    return styles[style] || styles.professional;
  }

  getColorScheme(scheme) {
    const schemes = {
      blue: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#60a5fa',
        background: '#f8fafc',
        text: '#1f2937'
      },
      green: {
        primary: '#10b981',
        secondary: '#047857',
        accent: '#34d399',
        background: '#f0fdf4',
        text: '#1f2937'
      },
      purple: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#a78bfa',
        background: '#faf5ff',
        text: '#1f2937'
      }
    };
    
    return schemes[scheme] || schemes.blue;
  }

  async drawGeometricPattern(ctx, width, height, colors) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    // Draw geometric shapes
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 20;
      
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      
      if (i % 3 === 0) {
        // Circle
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      } else if (i % 3 === 1) {
        // Rectangle
        ctx.rect(x, y, size, size);
      } else {
        // Triangle
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.closePath();
      }
      
      ctx.fill();
    }
    
    ctx.restore();
  }

  async drawPromptContent(ctx, prompt, width, height, colors) {
    // Main title from prompt
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    
    // Split prompt into words and create title
    const words = prompt.split(' ').slice(0, 4);
    const title = words.join(' ').toUpperCase();
    
    ctx.fillText(title, width / 2, height / 2 - 50);
    
    // Subtitle
    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Generated by HenMo AI', width / 2, height / 2 + 20);
    
    // Decorative line
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, height / 2 + 50);
    ctx.lineTo(width / 2 + 200, height / 2 + 50);
    ctx.stroke();
  }
}

module.exports = ImageGeneratorService;