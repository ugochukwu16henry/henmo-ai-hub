'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Clock, Database, Shield, Zap, Code, Globe, Camera, Brain } from 'lucide-react';

export default function NotesPage() {
  const testCategories = [
    {
      category: 'Authentication & Security',
      icon: Shield,
      color: 'text-red-600',
      tests: [
        { name: 'User Registration', endpoint: 'POST /api/auth/register', status: 'critical' },
        { name: 'User Login', endpoint: 'POST /api/auth/login', status: 'critical' },
        { name: 'Password Reset', endpoint: 'POST /api/auth/reset-password', status: 'high' },
        { name: 'JWT Token Validation', endpoint: 'Middleware validation', status: 'critical' },
        { name: 'Role-based Access Control', endpoint: 'Admin/Super Admin routes', status: 'high' },
        { name: 'Account Lockout (5 failed attempts)', endpoint: 'Login security', status: 'medium' },
        { name: 'Rate Limiting', endpoint: 'All API endpoints', status: 'medium' },
        { name: 'Session Management', endpoint: 'Token refresh/logout', status: 'high' }
      ]
    },
    {
      category: 'Database Operations',
      icon: Database,
      color: 'text-blue-600',
      tests: [
        { name: 'PostgreSQL Connection', endpoint: 'Database connectivity', status: 'critical' },
        { name: 'User CRUD Operations', endpoint: 'User management', status: 'critical' },
        { name: 'Admin System Tables', endpoint: 'Admin/roles/invitations', status: 'high' },
        { name: 'Memory Storage/Retrieval', endpoint: 'Memory system', status: 'high' },
        { name: 'Conversation History', endpoint: 'Chat persistence', status: 'medium' },
        { name: 'Financial Records', endpoint: 'Payment/wallet data', status: 'high' },
        { name: 'Analytics Data', endpoint: 'Usage tracking', status: 'medium' },
        { name: 'Migration Scripts', endpoint: 'Database schema updates', status: 'critical' }
      ]
    },
    {
      category: 'AI Core Features',
      icon: Brain,
      color: 'text-purple-600',
      tests: [
        { name: 'Code Analysis', endpoint: 'POST /api/ai-capabilities/analyze/code', status: 'critical' },
        { name: 'Security Scanning', endpoint: 'SAST/secrets detection', status: 'high' },
        { name: 'Multi-Language Support', endpoint: '11+ programming languages', status: 'high' },
        { name: 'Intelligent Debugging', endpoint: 'POST /api/ai-capabilities/debug/error', status: 'high' },
        { name: 'Code Generation', endpoint: 'POST /api/ai-capabilities/generate/code', status: 'medium' },
        { name: 'Performance Optimization', endpoint: 'POST /api/ai-capabilities/optimize/code', status: 'medium' },
        { name: 'File Operations', endpoint: 'Read/write/search files', status: 'high' },
        { name: 'Directory Scanning', endpoint: 'Recursive code analysis', status: 'medium' }
      ]
    },
    {
      category: 'Media Generation',
      icon: Camera,
      color: 'text-green-600',
      tests: [
        { name: 'Demo Video Generation', endpoint: 'POST /api/media/video/demo', status: 'high' },
        { name: 'App Showcase Video', endpoint: 'POST /api/media/video/showcase', status: 'medium' },
        { name: 'Version Release Video', endpoint: 'POST /api/media/video/version', status: 'medium' },
        { name: 'Custom Image Generation', endpoint: 'POST /api/media/image/generate', status: 'high' },
        { name: 'Company Branding', endpoint: 'POST /api/media/image/branding', status: 'high' },
        { name: 'Product Screenshots', endpoint: 'POST /api/media/image/screenshot', status: 'medium' },
        { name: 'Watermark Application', endpoint: 'HenMo AI branding', status: 'high' },
        { name: 'Media Download/Delete', endpoint: 'File management', status: 'medium' }
      ]
    },
    {
      category: 'API Endpoints',
      icon: Code,
      color: 'text-orange-600',
      tests: [
        { name: 'Health Check', endpoint: 'GET /api/health', status: 'critical' },
        { name: 'AI Chat Streaming', endpoint: 'POST /api/ai/stream', status: 'high' },
        { name: 'Memory Management', endpoint: 'POST /api/memory/*', status: 'high' },
        { name: 'User Management', endpoint: 'GET/POST/PUT/DELETE /api/users', status: 'high' },
        { name: 'Analytics Tracking', endpoint: 'POST /api/analytics/track', status: 'medium' },
        { name: 'File Upload', endpoint: 'POST /api/upload', status: 'medium' },
        { name: 'Payment Processing', endpoint: 'POST /api/payment/*', status: 'high' },
        { name: 'Email Services', endpoint: 'POST /api/email/*', status: 'medium' }
      ]
    },
    {
      category: 'Frontend Components',
      icon: Globe,
      color: 'text-cyan-600',
      tests: [
        { name: 'Dashboard Layout', endpoint: 'Navigation/sidebar', status: 'critical' },
        { name: 'AI Chat Interface', endpoint: 'Real-time messaging', status: 'high' },
        { name: 'Code Analysis UI', endpoint: 'Results display', status: 'high' },
        { name: 'Memory Browser', endpoint: 'Search/filter/export', status: 'medium' },
        { name: 'User Management', endpoint: 'Admin interface', status: 'high' },
        { name: 'Settings Page', endpoint: 'Profile/security/preferences', status: 'medium' },
        { name: 'Analytics Dashboard', endpoint: 'Charts/metrics', status: 'medium' },
        { name: 'Media Studio', endpoint: 'Generation interface', status: 'medium' }
      ]
    },
    {
      category: 'Performance & Scalability',
      icon: Zap,
      color: 'text-yellow-600',
      tests: [
        { name: 'API Response Time', endpoint: '< 2s for most endpoints', status: 'high' },
        { name: 'Database Query Performance', endpoint: 'Optimized queries', status: 'high' },
        { name: 'File Upload Speed', endpoint: 'Large file handling', status: 'medium' },
        { name: 'Concurrent Users', endpoint: '100+ simultaneous users', status: 'medium' },
        { name: 'Memory Usage', endpoint: 'Server resource monitoring', status: 'medium' },
        { name: 'WebSocket Performance', endpoint: 'Real-time features', status: 'medium' },
        { name: 'AI Processing Speed', endpoint: 'Code analysis timing', status: 'high' },
        { name: 'Media Generation Time', endpoint: 'Video/image creation', status: 'low' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <Clock className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const totalTests = testCategories.reduce((sum, cat) => sum + cat.tests.length, 0);
  const criticalTests = testCategories.reduce((sum, cat) => 
    sum + cat.tests.filter(t => t.status === 'critical').length, 0);
  const highTests = testCategories.reduce((sum, cat) => 
    sum + cat.tests.filter(t => t.status === 'high').length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testing Checklist</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing plan for HenMo AI Platform
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive">{criticalTests} Critical</Badge>
          <Badge variant="secondary">{highTests} High Priority</Badge>
          <Badge variant="outline">{totalTests} Total Tests</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{criticalTests}</p>
                <p className="text-sm text-muted-foreground">Critical Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{highTests}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalTests}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {testCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className={`h-5 w-5 ${category.color}`} />
                {category.category}
                <Badge variant="outline" className="ml-auto">
                  {category.tests.length} tests
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(test.status)}
                            {test.status}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{test.endpoint}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs text-muted-foreground">Tested</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Pre-Testing Setup:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Ensure PostgreSQL database is running with correct schema</li>
                <li>Set all environment variables (API keys, database URL, etc.)</li>
                <li>Install all dependencies: npm install in both /api and /hub directories</li>
                <li>Run database migrations: npm run migrate</li>
                <li>Create test user with credentials: ugochukwuhenry16@gmail.com / 1995Mobuchi@</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Testing Priority Order:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1 mt-2">
                <li><strong>Critical Tests First:</strong> Authentication, database, health checks</li>
                <li><strong>High Priority:</strong> Core AI features, user management, security</li>
                <li><strong>Medium Priority:</strong> Advanced features, UI components</li>
                <li><strong>Low Priority:</strong> Performance optimization, edge cases</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold">Test Environment:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>API Server: http://localhost:3001</li>
                <li>Frontend: http://localhost:3000</li>
                <li>Database: PostgreSQL (henmo_ai database)</li>
                <li>Required: Anthropic API key, OpenAI API key (optional)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}