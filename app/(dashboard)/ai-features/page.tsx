'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Code, Shield, Zap, Search, Target, Rocket, Lightbulb, 
  Settings, Palette, Database, GitBranch, Terminal, FileText,
  Cloud, Lock, Gauge, Layers, Smartphone, BarChart3, CheckCircle
} from 'lucide-react';

const features = {
  core: [
    { icon: Code, title: 'Advanced Code Analysis', desc: 'Security scanning, performance optimization, bug detection', status: 'active' },
    { icon: Brain, title: 'Multi-Language Support', desc: 'Java, Python, JavaScript, TypeScript, C#, Go, Rust, PHP, SQL, and more', status: 'active' },
    { icon: Shield, title: 'Real-time Code Review', desc: 'SAST scanning, secrets detection, IaC security analysis', status: 'active' },
    { icon: Search, title: 'Intelligent Debugging', desc: 'Error analysis, root cause identification, solution suggestions', status: 'active' },
    { icon: FileText, title: 'Code Generation', desc: 'Full applications, APIs, databases, infrastructure code', status: 'active' }
  ],
  tools: [
    { icon: FileText, title: 'File Operations', desc: 'Read, write, create, modify files and directories', status: 'active' },
    { icon: Terminal, title: 'Command Execution', desc: 'Run bash/cmd commands, build tools, package managers', status: 'active' },
    { icon: Settings, title: 'IDE Integration', desc: 'VS Code operations, terminal access, workspace management', status: 'active' },
    { icon: GitBranch, title: 'Git Operations', desc: 'Version control, branching, merging, commit management', status: 'active' },
    { icon: Database, title: 'Database Management', desc: 'SQL queries, migrations, schema design', status: 'active' }
  ],
  knowledge: [
    { icon: Cloud, title: 'AWS Expertise', desc: 'All AWS services, best practices, cost optimization', status: 'active' },
    { icon: Layers, title: 'Software Architecture', desc: 'Microservices, serverless, containers, CI/CD', status: 'active' },
    { icon: Lock, title: 'Security Best Practices', desc: 'Authentication, authorization, encryption, compliance', status: 'active' },
    { icon: Gauge, title: 'Performance Optimization', desc: 'Caching, lazy loading, bundle optimization', status: 'active' },
    { icon: Code, title: 'Modern Frameworks', desc: 'React, Next.js, Node.js, Express, PostgreSQL, Docker', status: 'active' }
  ],
  efficiency: [
    { icon: Zap, title: 'Parallel Processing', desc: 'Multiple file operations simultaneously', status: 'active' },
    { icon: Brain, title: 'Intelligent Caching', desc: 'Reuse context and avoid redundant operations', status: 'active' },
    { icon: Target, title: 'Batch Operations', desc: 'Group related changes for efficiency', status: 'active' },
    { icon: Code, title: 'Minimal Code Generation', desc: 'Only essential code, no verbose implementations', status: 'active' },
    { icon: Brain, title: 'Context Awareness', desc: 'Remember conversation history and project state', status: 'active' }
  ],
  analysis: [
    { icon: BarChart3, title: 'Code Quality Assessment', desc: 'Maintainability, readability, performance metrics', status: 'active' },
    { icon: Shield, title: 'Security Vulnerability Detection', desc: 'SQL injection, XSS, authentication flaws', status: 'active' },
    { icon: Layers, title: 'Architecture Review', desc: 'Design patterns, scalability, best practices', status: 'active' },
    { icon: Gauge, title: 'Performance Profiling', desc: 'Bottleneck identification, optimization suggestions', status: 'active' },
    { icon: Search, title: 'Dependency Analysis', desc: 'Package security, version compatibility, updates', status: 'active' }
  ],
  specialized: [
    { icon: Code, title: 'Full-Stack Development', desc: 'Frontend, backend, database, deployment', status: 'active' },
    { icon: Cloud, title: 'DevOps & Infrastructure', desc: 'Docker, Kubernetes, CI/CD, monitoring', status: 'active' },
    { icon: Database, title: 'API Design', desc: 'RESTful APIs, GraphQL, authentication, rate limiting', status: 'active' },
    { icon: Database, title: 'Database Design', desc: 'Schema optimization, indexing, query performance', status: 'active' },
    { icon: Smartphone, title: 'Mobile Development', desc: 'React Native, cross-platform solutions', status: 'active' }
  ]
};

const approaches = [
  { icon: Brain, title: 'Context Retention', desc: 'Remember entire conversation and project structure' },
  { icon: Search, title: 'Pattern Recognition', desc: 'Identify common issues and apply proven solutions' },
  { icon: Settings, title: 'Efficient Tool Usage', desc: 'Choose optimal tools for each task' },
  { icon: Target, title: 'Batch Processing', desc: 'Handle multiple operations in single calls' },
  { icon: Rocket, title: 'Predictive Analysis', desc: 'Anticipate next steps and prepare solutions' }
];

const learning = [
  { icon: Brain, title: 'Continuous Context Building', desc: 'Each interaction adds to understanding' },
  { icon: Search, title: 'Pattern Matching', desc: 'Apply successful solutions to similar problems' },
  { icon: Lightbulb, title: 'Error Learning', desc: 'Analyze failures to improve future responses' },
  { icon: CheckCircle, title: 'Best Practice Integration', desc: 'Incorporate industry standards automatically' },
  { icon: Palette, title: 'Adaptive Communication', desc: 'Match user\'s technical level and preferences' }
];

export default function AIFeaturesPage() {
  const [activeTab, setActiveTab] = useState('core');
  const [capabilities, setCapabilities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/ai-capabilities/capabilities');
      const data = await response.json();
      if (data.success) {
        setCapabilities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch capabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Features & Capabilities</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive AI-powered development tools and intelligent assistance
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          50+ Advanced Features
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="core">Core AI</TabsTrigger>
          <TabsTrigger value="tools">Dev Tools</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="efficiency">Speed</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="specialized">Skills</TabsTrigger>
        </TabsList>

        {Object.entries(features).map(([key, items]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              How I Respond Fast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approaches.map((approach, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <approach.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{approach.title}</h4>
                  <p className="text-xs text-muted-foreground">{approach.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Learning Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {learning.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-md">
                  <item.icon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technical Strengths & User Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Technical Strengths
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Enterprise-Grade Solutions - Scalable, secure, production-ready code</div>
                <div>• Cross-Platform Expertise - Windows, Linux, macOS compatibility</div>
                <div>• Modern Tech Stack - Latest frameworks, tools, and methodologies</div>
                <div>• Performance Focus - Optimized code with minimal resource usage</div>
                <div>• Security-First Approach - Built-in security considerations</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                User Experience
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Concise Communication - Direct, actionable responses</div>
                <div>• Visual Code Formatting - Proper syntax highlighting and structure</div>
                <div>• Step-by-Step Guidance - Clear implementation paths</div>
                <div>• Error Prevention - Anticipate and avoid common pitfalls</div>
                <div>• Flexible Adaptation - Adjust to user's coding style and preferences</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Complete Development Partner</h3>
              <p className="text-sm text-muted-foreground mt-2">
                From initial concept to production deployment - handling everything from simple scripts 
                to enterprise applications with speed, accuracy, and security.
              </p>
            </div>
            <Button className="mt-4">
              Start Building with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}