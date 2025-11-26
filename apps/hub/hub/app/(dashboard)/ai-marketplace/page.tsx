'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Download, Brain, Zap, Code, Users, TrendingUp } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  price: number;
  creator: string;
  tags: string[];
}

export default function AIMarketplacePage() {
  const [models] = useState<AIModel[]>([
    {
      id: '1',
      name: 'Code Assistant Pro',
      description: 'Advanced code generation and debugging assistant trained on 50M+ code repositories',
      category: 'Development',
      rating: 4.8,
      downloads: 15420,
      price: 29.99,
      creator: 'DevTools Inc',
      tags: ['JavaScript', 'Python', 'React', 'Node.js']
    },
    {
      id: '2',
      name: 'Content Creator AI',
      description: 'Generate high-quality blog posts, social media content, and marketing copy',
      category: 'Content',
      rating: 4.6,
      downloads: 8930,
      price: 19.99,
      creator: 'ContentCorp',
      tags: ['Writing', 'Marketing', 'SEO', 'Social Media']
    },
    {
      id: '3',
      name: 'Data Analyst Expert',
      description: 'Analyze datasets, create visualizations, and generate insights automatically',
      category: 'Analytics',
      rating: 4.9,
      downloads: 5670,
      price: 39.99,
      creator: 'DataWiz',
      tags: ['Python', 'SQL', 'Visualization', 'Statistics']
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Marketplace</h1>
          <p className="text-gray-600 mt-2">Discover and deploy custom AI models for specialized tasks</p>
        </div>
        <Button>
          <Brain className="h-4 w-4 mr-2" />
          Create Model
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-sm text-gray-600">Available Models</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">50K+</div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">25</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">4.7★</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Models</TabsTrigger>
          <TabsTrigger value="my-models">My Models</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="create">Create Model</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">by {model.creator}</p>
                    </div>
                    <Badge>{model.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{model.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{model.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {model.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${model.price}</span>
                    <Button size="sm">Install</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-models">
          <Card>
            <CardHeader>
              <CardTitle>Your AI Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">You haven't created any custom models yet.</p>
              <Button className="mt-4">
                <Brain className="h-4 w-4 mr-2" />
                Create Your First Model
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Response Accuracy</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-semibold">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Satisfaction</span>
                    <span className="font-semibold">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Queries</span>
                    <span className="font-semibold">12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-semibold">1,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Generated</span>
                    <span className="font-semibold">$2,340</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom AI Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Code className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="font-semibold mb-2">Fine-tune Existing</h3>
                      <p className="text-sm text-gray-600">Customize existing models with your data</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                      <h3 className="font-semibold mb-2">Train from Scratch</h3>
                      <p className="text-sm text-gray-600">Build completely custom models</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Zap className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h3 className="font-semibold mb-2">Quick Setup</h3>
                      <p className="text-sm text-gray-600">Use pre-built templates</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}