'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Download, FileText, Code } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens?: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  provider: string;
  model: string;
}

interface ConversationExportProps {
  conversation: Conversation;
  onClose: () => void;
}

export function ConversationExport({ conversation, onClose }: ConversationExportProps) {
  const [format, setFormat] = useState<'markdown' | 'json' | 'txt'>('markdown');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);

  const exportAsMarkdown = () => {
    let content = '';
    
    if (includeMetadata) {
      content += `# ${conversation.title}\n\n`;
      content += `**Created:** ${new Date(conversation.created_at).toLocaleString()}\n`;
      content += `**Provider:** ${conversation.provider}\n`;
      content += `**Model:** ${conversation.model}\n`;
      content += `**Messages:** ${conversation.messages.length}\n\n`;
      content += '---\n\n';
    }

    conversation.messages.forEach((message, index) => {
      const timestamp = includeTimestamps ? 
        ` *${new Date(message.timestamp).toLocaleString()}*` : '';
      
      content += `## ${message.role === 'user' ? 'User' : 'Assistant'}${timestamp}\n\n`;
      content += `${message.content}\n\n`;
    });

    return content;
  };

  const exportAsJSON = () => {
    const data = {
      conversation: {
        id: conversation.id,
        title: conversation.title,
        created_at: conversation.created_at,
        provider: conversation.provider,
        model: conversation.model
      },
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: includeTimestamps ? msg.timestamp : undefined,
        tokens: includeMetadata ? msg.tokens : undefined
      }))
    };
    
    return JSON.stringify(data, null, 2);
  };

  const exportAsText = () => {
    let content = '';
    
    if (includeMetadata) {
      content += `${conversation.title}\n`;
      content += `Created: ${new Date(conversation.created_at).toLocaleString()}\n`;
      content += `Provider: ${conversation.provider} (${conversation.model})\n\n`;
    }

    conversation.messages.forEach((message) => {
      const timestamp = includeTimestamps ? 
        ` [${new Date(message.timestamp).toLocaleString()}]` : '';
      
      content += `${message.role.toUpperCase()}${timestamp}:\n${message.content}\n\n`;
    });

    return content;
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'markdown':
        content = exportAsMarkdown();
        filename = `${conversation.title}.md`;
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = exportAsJSON();
        filename = `${conversation.title}.json`;
        mimeType = 'application/json';
        break;
      case 'txt':
        content = exportAsText();
        filename = `${conversation.title}.txt`;
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Conversation
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Markdown (.md)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    JSON (.json)
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Plain Text (.txt)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Options</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
              />
              <label htmlFor="metadata" className="text-sm">
                Include metadata (provider, model, stats)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timestamps"
                checked={includeTimestamps}
                onCheckedChange={(checked) => setIncludeTimestamps(checked === true)}
              />
              <label htmlFor="timestamps" className="text-sm">
                Include timestamps
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="font-medium mb-1">Preview:</div>
            <div className="text-gray-600">
              {conversation.title}.{format} • {conversation.messages.length} messages
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
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