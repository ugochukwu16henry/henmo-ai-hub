'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, MessageSquare, Share2, Clock, Brain, Folder } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: number;
  activeSession: boolean;
  lastActivity: string;
  type: 'team' | 'project' | 'department';
}

export default function CollaborationPage() {
  const [workspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Product Development',
      description: 'AI-powered product planning and development workflows',
      members: 8,
      activeSession: true,
      lastActivity: '2 minutes ago',
      type: 'team'
    },
    {
      id: '2',
      name: 'Marketing Campaign',
      description: 'Collaborative content creation and campaign planning',
      members: 5,
      activeSession: false,
      lastActivity: '1 hour ago',
      type: 'project'
    },
    {
      id: '3',
      name: 'Engineering Team',
      description: 'Code reviews, architecture discussions, and technical planning',
      members: 12,
      activeSession: true,
      lastActivity: '5 minutes ago',
      type: 'department'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Collaboration</h1>
          <p className="text-gray-600 mt-2">Work together with AI-powered collaborative workspaces</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Active Workspaces</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">25</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">2</div>
            <div className="text-sm text-gray-600">Live Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Shared Memories</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workspaces" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="shared">Shared Resources</TabsTrigger>
          <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{workspace.description}</p>
                    </div>
                    <Badge variant={workspace.type === 'team' ? 'default' : workspace.type === 'project' ? 'secondary' : 'outline'}>
                      {workspace.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{workspace.members} members</span>
                      </div>
                      {workspace.activeSession && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Live
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last activity: {workspace.lastActivity}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Product Development - AI Strategy Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>5 participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Started 15 minutes ago</span>
                    </div>
                  </div>
                  <Button size="sm">Join Session</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  Engineering Team - Code Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>3 participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Started 8 minutes ago</span>
                    </div>
                  </div>
                  <Button size="sm">Join Session</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Shared Memories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">API Documentation Standards</span>
                    <Badge variant="outline">Engineering</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Brand Guidelines</span>
                    <Badge variant="outline">Marketing</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Product Roadmap Q1</span>
                    <Badge variant="outline">Product</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Project Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Design System Components</span>
                    <Badge variant="outline">Design</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Testing Frameworks</span>
                    <Badge variant="outline">QA</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Deployment Scripts</span>
                    <Badge variant="outline">DevOps</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avg Session Duration</span>
                    <span className="font-semibold">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collaboration Score</span>
                    <span className="font-semibold">8.7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Knowledge Sharing</span>
                    <span className="font-semibold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Weekly Sessions</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Collaborators</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shared Resources</span>
                    <span className="font-semibold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}