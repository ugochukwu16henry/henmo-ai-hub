'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X } from 'lucide-react';
import api from '@/lib/api';
import { Memory } from '@/types';

interface SmartMemoryFormProps {
  onClose: () => void;
  onAdd: (memory: Memory) => void;
}

export function SmartMemoryForm({ onClose, onAdd }: SmartMemoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'note' | 'code'>('note');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setAnalyzing(true);
    try {
      const isCode = /^(import|export|function|class|const|let|var|def|public|private)/m.test(content) ||
                    content.includes('```') ||
                    /\.(js|ts|py|java|cpp|html|css)$/i.test(title);
      
      setType(isCode ? 'code' : 'note');
      
      const smartTags = generateSmartTags(content, title, isCode);
      setSuggestedTags(smartTags);
      
      if (!title.trim()) {
        const autoTitle = generateTitle(content, isCode);
        setTitle(autoTitle);
      }
    } catch (error) {
      console.error('Failed to analyze content:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSmartTags = (content: string, title: string, isCode: boolean): string[] => {
    const tags: string[] = [];
    const text = (content + ' ' + title).toLowerCase();
    
    const languages = ['javascript', 'typescript', 'python', 'java', 'react', 'nextjs', 'nodejs'];
    languages.forEach(lang => {
      if (text.includes(lang) || text.includes(lang.replace('js', ''))) {
        tags.push(lang);
      }
    });
    
    const topics = ['api', 'database', 'authentication', 'deployment', 'testing', 'ui', 'backend', 'frontend'];
    topics.forEach(topic => {
      if (text.includes(topic)) {
        tags.push(topic);
      }
    });
    
    if (isCode) {
      tags.push('code');
      if (text.includes('function') || text.includes('def')) tags.push('function');
      if (text.includes('class')) tags.push('class');
      if (text.includes('component')) tags.push('component');
    } else {
      tags.push('note');
      if (text.includes('todo') || text.includes('task')) tags.push('todo');
      if (text.includes('idea') || text.includes('concept')) tags.push('idea');
    }
    
    return Array.from(new Set(tags)).slice(0, 5);
  };

  const generateTitle = (content: string, isCode: boolean): string => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return 'Untitled';
    
    const firstLine = lines[0].trim();
    
    if (isCode) {
      const functionMatch = firstLine.match(/(?:function|def|class)\s+(\w+)/);
      if (functionMatch) return functionMatch[1];
      
      const componentMatch = firstLine.match(/(?:const|let|var)\s+(\w+)\s*=/);
      if (componentMatch) return componentMatch[1];
    }
    
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine;
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/memory', {
        title: title.trim(),
        content: content.trim(),
        type,
        tags,
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
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Smart Memory</span>
          </CardTitle>
          <CardDescription>AI-powered content analysis and tagging</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title (auto-generated if empty)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          
          <div className="relative">
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={analyzeContent}
              rows={8}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={analyzeContent}
              disabled={analyzing}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          
          {suggestedTags.length > 0 && (
            <div>
              <label className="text-sm font-medium">Suggested Tags:</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {tags.length > 0 && (
            <div>
              <label className="text-sm font-medium">Tags:</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="default" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save Memory'}
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