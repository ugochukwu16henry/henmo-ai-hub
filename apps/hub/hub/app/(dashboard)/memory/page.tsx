'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, FileText, Code, Trash2, Edit, Pin, PinOff, Download, Eye } from 'lucide-react';
import { MemoryEditor } from '@/components/memory/MemoryEditor';
import { MemoryDetail } from '@/components/memory/MemoryDetail';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags: string[];
  pinned?: boolean;
  created_at: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'note' | 'code'>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage for demo
    const saved = localStorage.getItem('memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    } else {
      // Demo data
      const demoMemories: Memory[] = [
        {
          id: '1',
          title: 'React Hook Pattern',
          content: 'const [state, setState] = useState(initialValue);\n\nuseEffect(() => {\n  // Side effect\n}, [dependency]);',
          type: 'code',
          tags: ['react', 'hooks', 'javascript'],
          pinned: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Project Ideas',
          content: '1. AI-powered code review tool\n2. Memory management system\n3. Development tracking dashboard',
          type: 'note',
          tags: ['ideas', 'projects'],
          created_at: new Date().toISOString()
        }
      ];
      setMemories(demoMemories);
      localStorage.setItem('memories', JSON.stringify(demoMemories));
    }
  }, []);

  const saveMemories = (newMemories: Memory[]) => {
    setMemories(newMemories);
    localStorage.setItem('memories', JSON.stringify(newMemories));
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || memory.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    saveMemories(memories.filter(m => m.id !== id));
  };

  const handleSave = (memory: Memory) => {
    if (editingMemory) {
      saveMemories(memories.map(m => m.id === memory.id ? memory : m));
    } else {
      saveMemories([memory, ...memories]);
    }
    setShowEditor(false);
    setEditingMemory(null);
  };

  const handlePin = (id: string) => {
    saveMemories(memories.map(m => 
      m.id === id ? { ...m, pinned: !m.pinned } : m
    ));
  };

  const handleExport = (memory: Memory) => {
    const blob = new Blob([memory.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.title}.${memory.type === 'code' ? 'txt' : 'md'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Memory Browser</h1>
            <p className="text-gray-600">Manage your saved notes and code snippets</p>
          </div>
          <Button onClick={() => setShowEditor(true)}>
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
            filteredMemories
              .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
              .map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onDelete={() => handleDelete(memory.id)}
                  onEdit={() => { setEditingMemory(memory); setShowEditor(true); }}
                  onPin={() => handlePin(memory.id)}
                  onView={() => setSelectedMemory(memory)}
                />
              ))
          )}
        </div>

        {/* Memory Editor */}
        {showEditor && (
          <MemoryEditor
            memory={editingMemory || undefined}
            onClose={() => { setShowEditor(false); setEditingMemory(null); }}
            onSave={handleSave}
          />
        )}

        {/* Memory Detail */}
        {selectedMemory && (
          <MemoryDetail
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
            onEdit={() => {
              setEditingMemory(selectedMemory);
              setSelectedMemory(null);
              setShowEditor(true);
            }}
            onPin={() => {
              handlePin(selectedMemory.id);
              setSelectedMemory({ ...selectedMemory, pinned: !selectedMemory.pinned });
            }}
            onExport={() => handleExport(selectedMemory)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function MemoryCard({ 
  memory, 
  onDelete, 
  onEdit, 
  onPin, 
  onView 
}: { 
  memory: Memory; 
  onDelete: () => void;
  onEdit: () => void;
  onPin: () => void;
  onView: () => void;
}) {
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
          {memory.pinned && <Pin className="h-3 w-3 text-yellow-500" />}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onPin}>
            {memory.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
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
        {new Date(memory.created_at).toLocaleDateString()}
      </p>
    </Card>
  );
}

