'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, FileText, Code, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Memory } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'note' | 'code'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await api.get('/memory');
      setMemories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    
    try {
      await api.delete(`/memory/${id}`);
      setMemories(memories.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Memory Browser</h1>
            <p className="text-gray-600">Manage your saved notes and code snippets</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Memory
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'note', 'code'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  onClick={() => setSelectedType(type as any)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Memory Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 mb-2" />
                <div className="h-3 w-full animate-pulse rounded bg-gray-200 mb-1" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
              </Card>
            ))
          ) : filteredMemories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No memories found</h3>
              <p className="text-gray-600">Create your first memory to get started</p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onDelete={() => handleDelete(memory.id)}
              />
            ))
          )}
        </div>

        {/* Add Memory Form */}
        {showAddForm && (
          <AddMemoryForm
            onClose={() => setShowAddForm(false)}
            onAdd={(newMemory) => {
              setMemories([newMemory, ...memories]);
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function MemoryCard({ memory, onDelete }: { memory: Memory; onDelete: () => void }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {memory.type === 'code' ? (
            <Code className="h-4 w-4 text-blue-600" />
          ) : (
            <FileText className="h-4 w-4 text-green-600" />
          )}
          <Badge variant={memory.type === 'code' ? 'default' : 'secondary'}>
            {memory.type}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      
      <h3 className="font-medium mb-2 line-clamp-1">{memory.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{memory.content}</p>
      
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {memory.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        {formatRelativeTime(memory.created_at)}
      </p>
    </Card>
  );
}

function AddMemoryForm({ onClose, onAdd }: { onClose: () => void; onAdd: (memory: Memory) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'note' | 'code'>('note');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/memory', {
        title: title.trim(),
        content: content.trim(),
        type,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      onAdd((response.data as any).data);
    } catch (error) {
      console.error('Failed to create memory:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Add Memory</CardTitle>
          <CardDescription>Save a note or code snippet</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <div className="flex space-x-2">
            {['note', 'code'].map((t) => (
              <Button
                key={t}
                type="button"
                variant={type === t ? 'default' : 'outline'}
                onClick={() => setType(t as any)}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
          
          <Input
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}