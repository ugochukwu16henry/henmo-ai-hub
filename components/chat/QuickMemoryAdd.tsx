'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Save, Tag } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags: string[];
  created_at: string;
}

interface QuickMemoryAddProps {
  initialContent?: string;
  onClose: () => void;
  onSave: (memory: Memory) => void;
}

export function QuickMemoryAdd({ initialContent = '', onClose, onSave }: QuickMemoryAddProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [type, setType] = useState<'note' | 'code'>('note');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const memory: Memory = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type,
      tags,
      created_at: new Date().toISOString()
    };

    // Save to localStorage
    const saved = localStorage.getItem('memories');
    const memories = saved ? JSON.parse(saved) : [];
    const updated = [memory, ...memories];
    localStorage.setItem('memories', JSON.stringify(updated));

    onSave(memory);
    onClose();
  };

  // Auto-detect if content looks like code
  const detectType = (text: string) => {
    const codeIndicators = ['function', 'const', 'let', 'var', 'import', 'export', '{', '}', '=>', '()', 'class'];
    const hasCodeIndicators = codeIndicators.some(indicator => text.includes(indicator));
    if (hasCodeIndicators && type === 'note') {
      setType('code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Quick Save to Memory
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Memory title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'note' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setType('note')}
            >
              Note
            </Button>
            <Button
              type="button"
              variant={type === 'code' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setType('code')}
            >
              Code
            </Button>
          </div>

          <div>
            <Textarea
              placeholder="Content..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                detectType(e.target.value);
              }}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} size="sm">
                <Tag className="w-3 h-3" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!title.trim() || !content.trim()} className="flex-1">
              Save Memory
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}