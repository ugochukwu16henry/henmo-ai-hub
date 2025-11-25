'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Edit, Pin, PinOff, Download, Copy } from 'lucide-react';
import { CodeHighlight } from './CodeHighlight';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags: string[];
  pinned?: boolean;
  created_at: string;
}

interface MemoryDetailProps {
  memory: Memory;
  onClose: () => void;
  onEdit: () => void;
  onPin: () => void;
  onExport: () => void;
}

export function MemoryDetail({ memory, onClose, onEdit, onPin, onExport }: MemoryDetailProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(memory.content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">{memory.title}</CardTitle>
              <Badge variant={memory.type === 'code' ? 'default' : 'secondary'}>
                {memory.type}
              </Badge>
              {memory.pinned && <Pin className="w-4 h-4 text-yellow-500" />}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onPin}>
                {memory.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            Created: {new Date(memory.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        
        <CardContent>
          {memory.type === 'code' ? (
            <CodeHighlight code={memory.content} />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{memory.content}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}