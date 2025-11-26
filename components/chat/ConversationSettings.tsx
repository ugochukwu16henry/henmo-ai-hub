'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Settings, Archive, Trash2, Share } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  mode: 'chat' | 'code' | 'analysis';
  provider: 'openai' | 'anthropic';
  model: string;
  archived: boolean;
  created_at: string;
}

interface ConversationSettingsProps {
  conversation: Conversation;
  onClose: () => void;
  onUpdate: (updates: Partial<Conversation>) => void;
  onDelete: () => void;
  onShare: () => void;
  onExport: () => void;
}

export function ConversationSettings({
  conversation,
  onClose,
  onUpdate,
  onDelete,
  onShare,
  onExport
}: ConversationSettingsProps) {
  const [title, setTitle] = useState(conversation.title);
  const [mode, setMode] = useState(conversation.mode);
  const [provider, setProvider] = useState(conversation.provider);
  const [model, setModel] = useState(conversation.model);

  const handleSave = () => {
    onUpdate({ title, mode, provider, model });
    onClose();
  };

  const handleArchive = () => {
    onUpdate({ archived: !conversation.archived });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Delete this conversation? This cannot be undone.')) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Conversation Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Conversation title"
            />
          </div>

          <div>
            <Label htmlFor="mode">Mode</Label>
            <Select value={mode} onValueChange={(value: any) => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="code">Code Assistant</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: any) => setProvider(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provider === 'openai' ? (
                  <>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button onClick={onShare} variant="outline" className="w-full">
              <Share className="w-4 h-4 mr-2" />
              Share Conversation
            </Button>
            
            <Button onClick={onExport} variant="outline" className="w-full">
              Export Conversation
            </Button>
            
            <Button onClick={handleArchive} variant="outline" className="w-full">
              <Archive className="w-4 h-4 mr-2" />
              {conversation.archived ? 'Unarchive' : 'Archive'}
            </Button>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}