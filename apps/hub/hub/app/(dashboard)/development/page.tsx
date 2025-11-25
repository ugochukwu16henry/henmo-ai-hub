'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Folder, Code, GitBranch, Clock } from 'lucide-react';

interface DevEntry {
  id: string;
  timestamp: string;
  type: 'feature' | 'file' | 'folder' | 'code' | 'update';
  title: string;
  description: string;
  files: string[];
  status: 'planned' | 'in-progress' | 'completed';
}

export default function DevelopmentPage() {
  const [entries, setEntries] = useState<DevEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    type: 'feature' as const,
    title: '',
    description: '',
    files: [''],
    status: 'planned' as const
  });

  useEffect(() => {
    const saved = localStorage.getItem('dev-tracking');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // Auto-save Memory Browser completion
      const memoryEntry: DevEntry = {
        id: '4',
        timestamp: new Date().toISOString(),
        type: 'feature',
        title: 'Memory Browser - Complete Implementation',
        description: 'Enhanced memory browser with edit, pin, detail view, syntax highlighting, and export features',
        files: [
          'apps/hub/hub/components/memory/MemoryEditor.tsx',
          'apps/hub/hub/components/memory/CodeHighlight.tsx', 
          'apps/hub/hub/components/memory/MemoryDetail.tsx',
          'apps/hub/hub/app/(dashboard)/memory/page.tsx'
        ],
        status: 'completed'
      };
      
      const initialEntries: DevEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'feature',
          title: 'Multi-Level Admin System',
          description: 'Hierarchical admin system with Super Admin → Country Admins → Moderators → Users',
          files: ['apps/api/migrations/001_admin_system.sql', 'apps/api/src/controllers/secure-auth.controller.js'],
          status: 'completed'
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          type: 'feature',
          title: 'Advanced AI Capabilities',
          description: 'Code analysis, debugging, security scanning, performance optimization',
          files: ['apps/api/src/services/advanced-ai.service.js', 'apps/hub/hub/app/(dashboard)/ai-tools/page.tsx'],
          status: 'completed'
        },
        {
          id: '3',
          timestamp: new Date().toISOString(),
          type: 'feature',
          title: 'Self-Learning System',
          description: 'AI learning plugin that processes approved materials to build knowledge base',
          files: ['apps/api/src/services/self-learning.service.js', 'apps/hub/hub/app/(dashboard)/learning/page.tsx'],
          status: 'completed'
        },
        memoryEntry
      ];
      setEntries(initialEntries);
      localStorage.setItem('dev-tracking', JSON.stringify(initialEntries));
    }
  }, []);

  const saveEntries = (newEntries: DevEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('dev-tracking', JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!newEntry.title) return;
    
    const entry: DevEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newEntry,
      files: newEntry.files.filter(f => f.trim())
    };
    
    saveEntries([entry, ...entries]);
    setNewEntry({
      type: 'feature',
      title: '',
      description: '',
      files: [''],
      status: 'planned'
    });
  };

  // Auto-save new development when files are created/modified
  const autoSaveEntry = (title: string, description: string, files: string[], type: DevEntry['type'] = 'code') => {
    const entry: DevEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      title,
      description,
      files,
      status: 'completed'
    };
    
    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);
    
    // Show notification
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      notification.textContent = `Auto-saved: ${title}`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  // Expose auto-save function globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).autoSaveDevEntry = autoSaveEntry;
    }
  }, [entries]);

  const updateStatus = (id: string, status: DevEntry['status']) => {
    saveEntries(entries.map(e => e.id === id ? { ...e, status } : e));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileText className="w-4 h-4" />;
      case 'folder': return <Folder className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      default: return <GitBranch className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Development Tracking</h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {entries.length} entries
        </Badge>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="add">Add Entry</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(entry.type)}
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{entry.description}</p>
                {entry.files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Files:</h4>
                    <div className="grid gap-1">
                      {entry.files.map((file, idx) => (
                        <code key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  {entry.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(entry.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {entry.status === 'planned' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(entry.id, 'in-progress')}
                    >
                      Start Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Auto-Save Active</h3>
            <p className="text-sm text-blue-700">
              Development entries are automatically saved when new code is created or files are modified.
              Manual entries can be added below for planning or documentation.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Add Development Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({...newEntry, type: e.target.value as any})}
                  >
                    <option value="feature">Feature</option>
                    <option value="file">File</option>
                    <option value="folder">Folder</option>
                    <option value="code">Code</option>
                    <option value="update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={newEntry.status}
                    onChange={(e) => setNewEntry({...newEntry, status: e.target.value as any})}
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="Enter title..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  placeholder="Enter description..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Files</label>
                {newEntry.files.map((file, idx) => (
                  <Input
                    key={idx}
                    value={file}
                    onChange={(e) => {
                      const files = [...newEntry.files];
                      files[idx] = e.target.value;
                      setNewEntry({...newEntry, files});
                    }}
                    placeholder="File path..."
                    className="mt-1"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewEntry({...newEntry, files: [...newEntry.files, '']})}
                  className="mt-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add File
                </Button>
              </div>
              
              <Button onClick={addEntry} className="w-full">
                Add Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {entries.filter(e => e.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {entries.filter(e => e.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {entries.filter(e => e.status === 'planned').length}
                </div>
                <div className="text-sm text-gray-600">Planned</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}