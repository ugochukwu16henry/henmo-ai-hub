'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationTrendsChart } from '@/components/analytics/ConversationTrendsChart';
import { TokenUsageChart } from '@/components/analytics/TokenUsageChart';
import { CostAnalysisChart } from '@/components/analytics/CostAnalysisChart';
import { MemoryGrowthChart } from '@/components/analytics/MemoryGrowthChart';
import { ProviderUsageChart } from '@/components/analytics/ProviderUsageChart';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Brain, 
  Download,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackDevelopment(
      'Analytics Dashboard',
      'Comprehensive analytics with conversation trends, token usage, cost analysis, and memory growth charts',
      [
        'apps/hub/hub/app/(dashboard)/analytics/page.tsx',
        'apps/hub/hub/components/analytics/ConversationTrendsChart.tsx',
        'apps/hub/hub/components/analytics/TokenUsageChart.tsx',
        'apps/hub/hub/components/analytics/CostAnalysisChart.tsx',
        'apps/hub/hub/components/analytics/MemoryGrowthChart.tsx',
        'apps/hub/hub/components/analytics/ProviderUsageChart.tsx'
      ],
      'feature'
    );
  }, []);

  const exportReport = () => {
    const reportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalConversations: 156,
        totalTokens: 2450000,
        totalCost: 45.67,
        totalMemories: 89
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your AI usage and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-green-600">+12% from last period</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold">2.45M</p>
                <p className="text-xs text-green-600">+8% from last period</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold">$45.67</p>
                <p className="text-xs text-red-600">+15% from last period</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Memories Saved</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-green-600">+25% from last period</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="tokens">Token Usage</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="memory">Memory Growth</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Conversation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationTrendsChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Token Usage Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TokenUsageChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CostAnalysisChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Memory Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MemoryGrowthChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Provider Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProviderUsageChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}