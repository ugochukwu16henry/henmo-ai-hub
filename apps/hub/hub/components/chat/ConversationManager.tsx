'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ConversationSettings } from './ConversationSettings';
import { ConversationExport } from './ConversationExport';
import { TokenUsageChart } from './TokenUsageChart';
import { 
  Search, 
  Filter, 
  Settings, 
  Download, 
  Share, 
  Archive, 
  Trash2,
  MessageSquare,
  Zap,
  X
} from 'lucide-react';
import { EnhancedChatInterface } from './EnhancedChatInterface';
import { trackDevelopment } from '@/lib/dev-tracker';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    estimated_cost: number;
  };
}

interface Conversation {
  id: string;
  title: string;
  mode: 'chat' | 'code' | 'analysis';
  provider: 'openai' | 'anthropic';
  model: string;
  archived: boolean;
  created_at: string;
  messages: Message[];
}

export function ConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadConversations();
    trackDevelopment(
      'Conversation Management Enhancements',
      'Advanced conversation features: settings, export, token usage, search, and filters',
      [
        'apps/hub/hub/components/chat/ConversationSettings.tsx',
        'apps/hub/hub/components/chat/ConversationExport.tsx',
        'apps/hub/hub/components/chat/TokenUsageChart.tsx',
        'apps/hub/hub/components/chat/ConversationManager.tsx'
      ],
      'feature'
    );
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm, providerFilter, statusFilter]);

  const loadConversations = () => {
    // Demo data with token usage
    const demoConversations: Conversation[] = [
      {
        id: '1',
        title: 'React Development Help',
        mode: 'code',
        provider: 'anthropic',
        model: 'claude-3-sonnet',
        archived: false,
        created_at: '2024-01-15T10:00:00Z',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'Help me create a React component',
            timestamp: '2024-01-15T10:00:00Z',
            tokens: { input_tokens: 8, output_tokens: 0, total_tokens: 8, estimated_cost: 0.000024 }
          },
          {
            id: '2',
            role: 'assistant',
            content: 'I\'ll help you create a React component. Here\'s a basic example...',
            timestamp: '2024-01-15T10:01:00Z',
            tokens: { input_tokens: 0, output_tokens: 150, total_tokens: 150, estimated_cost: 0.00225 }
          }
        ]
      },
      {
        id: '2',
        title: 'Data Analysis Project',
        mode: 'analysis',
        provider: 'openai',
        model: 'gpt-4',
        archived: false,
        created_at: '2024-01-14T15:30:00Z',
        messages: [
          {
            id: '3',
            role: 'user',
            content: 'Analyze this dataset for trends',
            timestamp: '2024-01-14T15:30:00Z',
            tokens: { input_tokens: 12, output_tokens: 0, total_tokens: 12, estimated_cost: 0.00036 }
          }
        ]
      }
    ];
    setConversations(demoConversations);
  };

  const filterConversations = () => {
    let filtered = conversations.filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.messages.some(msg => 
                             msg.content.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesProvider = providerFilter === 'all' || conv.provider === providerFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'archived' && conv.archived) ||
                           (statusFilter === 'active' && !conv.archived);
      return matchesSearch && matchesProvider && matchesStatus;
    });
    setFilteredConversations(filtered);
  };

  const handleConversationUpdate = (id: string, updates: Partial<Conversation>) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, ...updates } : conv
    ));
  };

  const handleConversationDelete = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
  };

  const handleShare = (conversation: Conversation) => {
    const shareUrl = `${window.location.origin}/shared/${conversation.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const getTotalTokens = (conversation: Conversation) => {
    return conversation.messages.reduce((total, msg) => 
      total + (msg.tokens?.total_tokens || 0), 0
    );
  };

  const getTotalCost = (conversation: Conversation) => {
    return conversation.messages.reduce((total, msg) => 
      total + (msg.tokens?.estimated_cost || 0), 0
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-gray-600">Manage and analyze your AI conversations</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search conversations and messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Conversation List */}
      <div className="grid gap-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{conversation.title}</h3>
                    <Badge variant="outline">{conversation.mode}</Badge>
                    <Badge variant="secondary">
                      {conversation.provider} • {conversation.model}
                    </Badge>
                    {conversation.archived && (
                      <Badge variant="outline">
                        <Archive className="w-3 h-3 mr-1" />
                        Archived
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {conversation.messages.length} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {getTotalTokens(conversation).toLocaleString()} tokens
                    </span>
                    <span>${getTotalCost(conversation).toFixed(4)}</span>
                    <span>{new Date(conversation.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowChat(true);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowTokens(true);
                    }}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(conversation)}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowExport(true);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setShowSettings(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {showSettings && selectedConversation && (
        <ConversationSettings
          conversation={selectedConversation}
          onClose={() => setShowSettings(false)}
          onUpdate={(updates) => handleConversationUpdate(selectedConversation.id, updates)}
          onDelete={() => handleConversationDelete(selectedConversation.id)}
          onShare={() => handleShare(selectedConversation)}
          onExport={() => {
            setShowSettings(false);
            setShowExport(true);
          }}
        />
      )}

      {showExport && selectedConversation && (
        <ConversationExport
          conversation={selectedConversation}
          onClose={() => setShowExport(false)}
        />
      )}

      {showTokens && selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Token Usage - {selectedConversation.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowTokens(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TokenUsageChart
                messages={selectedConversation.messages}
                provider={selectedConversation.provider}
                model={selectedConversation.model}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {showChat && selectedConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedConversation.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(95vh-5rem)]">
              <EnhancedChatInterface conversationId={selectedConversation.id} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}