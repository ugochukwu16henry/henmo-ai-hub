'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Brain, DollarSign, AlertTriangle, Target, Zap, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const userBehaviorData = [
    { date: '2026-03-01', activeUsers: 1200, newUsers: 150, churnRate: 2.1 },
    { date: '2026-03-08', activeUsers: 1350, newUsers: 180, churnRate: 1.8 },
    { date: '2026-03-15', activeUsers: 1500, newUsers: 220, churnRate: 1.5 },
    { date: '2026-03-22', activeUsers: 1680, newUsers: 250, churnRate: 1.2 }
  ];

  const revenueData = [
    { month: 'Jan', actual: 45000, predicted: 42000 },
    { month: 'Feb', actual: 52000, predicted: 48000 },
    { month: 'Mar', actual: 61000, predicted: 58000 },
    { month: 'Apr', actual: null, predicted: 68000 },
    { month: 'May', actual: null, predicted: 75000 }
  ];

  const churnPrediction = [
    { segment: 'High Risk', value: 15, color: '#ef4444' },
    { segment: 'Medium Risk', value: 25, color: '#f59e0b' },
    { segment: 'Low Risk', value: 60, color: '#10b981' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">AI-powered business intelligence and predictive insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')}>7D</Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('30d')}>30D</Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('90d')}>90D</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">94.2%</div>
                <div className="text-sm text-gray-600">Prediction Accuracy</div>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">$127K</div>
                <div className="text-sm text-gray-600">Predicted Revenue</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">1.5%</div>
                <div className="text-sm text-gray-600">Churn Risk</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">8.7</div>
                <div className="text-sm text-gray-600">NPS Score</div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="behavior" className="space-y-4">
        <TabsList>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Forecasting</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeUsers" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Behavioral Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-sm">Peak Usage Hours</span>
                    <Badge>9-11 AM, 2-4 PM</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-sm">Most Used Feature</span>
                    <Badge>AI Chat (78%)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="text-sm">Avg Session Duration</span>
                    <Badge>24 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span className="text-sm">User Satisfaction</span>
                    <Badge>4.8/5 ⭐</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Forecasting Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#3b82f6" name="Actual Revenue" />
                  <Bar dataKey="predicted" fill="#10b981" name="Predicted Revenue" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-blue-600">$61K</div>
                  <div className="text-sm text-gray-600">Current Month</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-green-600">$68K</div>
                  <div className="text-sm text-gray-600">Next Month Prediction</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-purple-600">+11.5%</div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Churn Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={churnPrediction}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {churnPrediction.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Prevention Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-red-500 bg-red-50">
                    <div className="font-semibold text-red-800">High Risk Users (15%)</div>
                    <div className="text-sm text-red-600 mt-1">Immediate intervention required</div>
                    <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">Send Retention Campaign</Button>
                  </div>
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                    <div className="font-semibold text-yellow-800">Medium Risk Users (25%)</div>
                    <div className="text-sm text-yellow-600 mt-1">Engagement boost recommended</div>
                    <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700">Increase Engagement</Button>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <div className="font-semibold text-green-800">Low Risk Users (60%)</div>
                    <div className="text-sm text-green-600 mt-1">Maintain current experience</div>
                    <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">Upsell Opportunities</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                A/B Testing Framework
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">5</div>
                        <div className="text-sm text-gray-600">Active Tests</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-gray-600">Completed Tests</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">67%</div>
                        <div className="text-sm text-gray-600">Win Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">New Onboarding Flow</span>
                      <Badge variant="default">Running</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Testing simplified vs. detailed onboarding process</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold">Variant A: 23.5%</div>
                        <div className="text-xs text-gray-600">Conversion Rate</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold">Variant B: 28.2%</div>
                        <div className="text-xs text-gray-600">Conversion Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Pricing Page Layout</span>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Tested different pricing tier presentations</div>
                    <div className="text-sm">
                      <span className="text-green-600 font-semibold">Winner:</span> Variant B (+15.3% conversions)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="font-semibold text-blue-800 mb-2">🚀 Growth Opportunity</div>
                  <p className="text-blue-700 text-sm">
                    Users who engage with the AI Marketplace in their first week have 3.2x higher retention rates. 
                    Consider adding marketplace onboarding to the welcome flow.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <div className="font-semibold text-green-800 mb-2">💡 Feature Insight</div>
                  <p className="text-green-700 text-sm">
                    Collaboration features show 45% higher engagement on Tuesdays and Wednesdays. 
                    Schedule team-focused notifications and features for mid-week.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="font-semibold text-yellow-800 mb-2">⚠️ Risk Alert</div>
                  <p className="text-yellow-700 text-sm">
                    Users with less than 5 AI interactions in their first month have 78% churn probability. 
                    Implement early engagement campaigns for low-activity users.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <div className="font-semibold text-purple-800 mb-2">📊 Market Trend</div>
                  <p className="text-purple-700 text-sm">
                    Enterprise features adoption is growing 23% month-over-month. 
                    Consider expanding enterprise sales team and developing advanced compliance features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}