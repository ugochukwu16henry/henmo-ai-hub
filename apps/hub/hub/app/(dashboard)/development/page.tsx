'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, Shield, Code, DollarSign, Globe, Server, Database, Zap } from 'lucide-react';

interface DevelopmentModule {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  features: string[];
  codeFiles: number;
  linesOfCode: number;
  category: 'security' | 'ai' | 'business' | 'infrastructure' | 'frontend';
}

export default function DevelopmentPage() {
  const modules: DevelopmentModule[] = [
    {
      id: '1',
      name: 'Multi-Level Admin System',
      description: 'Hierarchical admin system with Super Admin → Country Admins → Moderators → Users',
      status: 'completed',
      features: ['Role-based access', 'Invitation system', 'User management', 'Country assignment'],
      codeFiles: 8,
      linesOfCode: 2500,
      category: 'security'
    },
    {
      id: '2',
      name: 'Secure Authentication',
      description: 'Enterprise-grade security with account lockout, rate limiting, and bot detection',
      status: 'completed',
      features: ['bcrypt hashing', 'Session tokens', 'Rate limiting', 'Account lockout'],
      codeFiles: 6,
      linesOfCode: 1800,
      category: 'security'
    },
    {
      id: '3',
      name: 'Advanced AI Capabilities',
      description: 'Multi-model AI with code analysis, debugging, and security scanning',
      status: 'completed',
      features: ['Claude API', 'OpenAI integration', 'Code analysis', 'Security scanning'],
      codeFiles: 12,
      linesOfCode: 3200,
      category: 'ai'
    },
    {
      id: '4',
      name: 'Self-Learning System',
      description: 'AI learning plugin that processes approved materials to build knowledge base',
      status: 'completed',
      features: ['Knowledge processing', 'Learning algorithms', 'Content approval', 'Response enhancement'],
      codeFiles: 5,
      linesOfCode: 1500,
      category: 'ai'
    },
    {
      id: '5',
      name: 'Memory Management',
      description: 'Enhanced memory system with edit, pin, detail view, and export features',
      status: 'completed',
      features: ['Memory browser', 'Syntax highlighting', 'Export functionality', 'Search & filter'],
      codeFiles: 8,
      linesOfCode: 2200,
      category: 'ai'
    },
    {
      id: '6',
      name: 'Financial Management',
      description: 'Multi-currency wallet, revenue tracking, and payment integration',
      status: 'completed',
      features: ['Stripe integration', 'Paystack support', 'Multi-currency', 'Financial reporting'],
      codeFiles: 10,
      linesOfCode: 2800,
      category: 'business'
    },
    {
      id: '7',
      name: 'Street Image Platform',
      description: 'Complete image platform with GPS, verification, and contributor system',
      status: 'completed',
      features: ['Image upload', 'GPS integration', 'AI verification', 'Contributor earnings'],
      codeFiles: 15,
      linesOfCode: 4000,
      category: 'business'
    },
    {
      id: '8',
      name: 'Plugin System',
      description: 'Plugin marketplace with browse, install, and developer portal',
      status: 'completed',
      features: ['Plugin marketplace', 'Developer portal', 'Installation system', 'Plugin management'],
      codeFiles: 12,
      linesOfCode: 3500,
      category: 'frontend'
    },
    {
      id: '9',
      name: 'Production Infrastructure',
      description: 'Docker deployment, CI/CD pipeline, and monitoring systems',
      status: 'completed',
      features: ['Docker containers', 'GitHub Actions', 'Monitoring setup', 'Multi-platform deployment'],
      codeFiles: 20,
      linesOfCode: 2000,
      category: 'infrastructure'
    },
    {
      id: '10',
      name: 'Marketing Website',
      description: 'Public marketing site with dynamic content management',
      status: 'completed',
      features: ['Marketing pages', 'Content management', 'SEO optimization', 'Social media integration'],
      codeFiles: 10,
      linesOfCode: 2500,
      category: 'frontend'
    }
  ];

  const totalFiles = modules.reduce((acc, module) => acc + module.codeFiles, 0);
  const totalLines = modules.reduce((acc, module) => acc + module.linesOfCode, 0);
  const completedModules = modules.filter(m => m.status === 'completed').length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-5 w-5 text-red-600" />;
      case 'ai': return <Brain className="h-5 w-5 text-purple-600" />;
      case 'business': return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'infrastructure': return <Server className="h-5 w-5 text-orange-600" />;
      case 'frontend': return <Globe className="h-5 w-5 text-blue-600" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'bg-red-100 text-red-800';
      case 'ai': return 'bg-purple-100 text-purple-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'infrastructure': return 'bg-orange-100 text-orange-800';
      case 'frontend': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Development Overview</h1>
          <p className="text-gray-600 mt-2">Complete HenMo AI development journey - Built by Henry M. Ugochukwu</p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          {completedModules}/{modules.length} Modules Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalLines.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Lines of Code</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{totalFiles}</div>
            <div className="text-sm text-gray-600">Code Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Months Development</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">100+</div>
            <div className="text-sm text-gray-600">Sleepless Nights</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Development Modules</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(module.category)}
                        {module.name}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                    <Badge className={getCategoryColor(module.category)}>
                      {module.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>{module.codeFiles} files</span>
                      <span>{module.linesOfCode.toLocaleString()} lines</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>8-Month Development Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">March 2024 - Research & Planning</div>
                    <div className="text-sm text-gray-600">AI market research, technology evaluation, system architecture design</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold">April-May 2024 - Security Foundation</div>
                    <div className="text-sm text-gray-600">Multi-level admin system, secure authentication, role-based access</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">June-July 2024 - Core AI Features</div>
                    <div className="text-sm text-gray-600">AI integration, memory system, self-learning capabilities</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">August-September 2024 - Business Features</div>
                    <div className="text-sm text-gray-600">Payment systems, financial management, street image platform</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Server className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold">October-November 2024 - Production</div>
                    <div className="text-sm text-gray-600">Docker deployment, CI/CD pipeline, marketing website, launch preparation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm"><strong>Marketing:</strong> Next.js 14, Tailwind CSS</div>
                  <div className="text-sm"><strong>Dashboard:</strong> React 18, TypeScript, Zustand</div>
                  <div className="text-sm"><strong>Mobile:</strong> React Native, Expo</div>
                  <div className="text-sm"><strong>Components:</strong> Shadcn/ui, Lucide Icons</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm"><strong>API:</strong> Node.js, Express.js</div>
                  <div className="text-sm"><strong>Database:</strong> PostgreSQL, Redis</div>
                  <div className="text-sm"><strong>Auth:</strong> JWT, bcrypt, Sessions</div>
                  <div className="text-sm"><strong>AI:</strong> Anthropic Claude, OpenAI</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm"><strong>Deployment:</strong> Docker, Railway, Vercel</div>
                  <div className="text-sm"><strong>Storage:</strong> AWS S3, CloudFront CDN</div>
                  <div className="text-sm"><strong>Monitoring:</strong> Sentry, LogRocket, Grafana</div>
                  <div className="text-sm"><strong>CI/CD:</strong> GitHub Actions</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>The Development Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Built by Henry M. Ugochukwu</h3>
                <p>
                  HenMo AI represents 8 months of intensive development, research, and countless sleepless nights. 
                  What started as a vision for a truly personal AI assistant evolved into a comprehensive platform 
                  with advanced features and enterprise-grade security.
                </p>
                
                <h4>The Challenge</h4>
                <p>
                  Creating an AI platform that goes beyond simple chat - one that remembers, learns, and adapts 
                  to individual users while maintaining the highest security standards and supporting multiple 
                  business models.
                </p>
                
                <h4>The Solution</h4>
                <p>
                  A multi-layered platform combining advanced AI capabilities with robust business features:
                  secure authentication, financial management, content creation tools, and a complete 
                  ecosystem for AI-powered productivity.
                </p>
                
                <h4>Key Achievements</h4>
                <ul>
                  <li>Built from scratch with modern technologies</li>
                  <li>Implemented enterprise-grade security</li>
                  <li>Created scalable multi-tenant architecture</li>
                  <li>Integrated multiple AI providers</li>
                  <li>Developed comprehensive business features</li>
                  <li>Achieved production-ready deployment</li>
                </ul>

                <h4>Development Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">26,000+</div>
                    <div className="text-sm text-gray-600">Total Lines of Code</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">106</div>
                    <div className="text-sm text-gray-600">Code Files</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">10</div>
                    <div className="text-sm text-gray-600">Major Modules</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">50+</div>
                    <div className="text-sm text-gray-600">Features Built</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}