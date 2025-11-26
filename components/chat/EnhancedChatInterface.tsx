'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { RelevantMemories } from './RelevantMemories';
import { QuickMemoryAdd } from './QuickMemoryAdd';
import { 
  Send, 
  Bot, 
  User, 
  Save, 
  Brain, 
  Copy, 
  Check,
  Sidebar
} from 'lucide-react';
import { trackDevelopment } from '@/lib/dev-tracker';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags: string[];
  created_at: string;
}

interface EnhancedChatInterfaceProps {
  conversationId: string;
}

export function EnhancedChatInterface({ conversationId }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMemories, setShowMemories] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddContent, setQuickAddContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Demo messages
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant with memory integration. I can help you save important information and recall it later.',
        timestamp: new Date().toISOString()
      }
    ]);

    trackDevelopment(
      'Memory Integration with AI Chat',
      'Enhanced chat interface with memory suggestions, quick save, and inline memory references',
      [
        'apps/hub/hub/components/chat/RelevantMemories.tsx',
        'apps/hub/hub/components/chat/QuickMemoryAdd.tsx',
        'apps/hub/hub/components/chat/EnhancedChatInterface.tsx'
      ],
      'feature'
    );
  }, [conversationId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    const responses = [
      'I understand your question. Based on your previous conversations and memories, here\'s what I can help with...',
      'That\'s an interesting point! I notice you\'ve saved similar information before. Would you like me to reference your memories?',
      'Great question! I can help you with that. This might be worth saving to your memory for future reference.',
      'I see you\'re working on something complex. Let me break this down and suggest saving key parts to memory.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleMemorySelect = (memory: Memory) => {
    const reference = `[Memory: ${memory.title}]\n${memory.content.substring(0, 100)}${memory.content.length > 100 ? '...' : ''}`;
    setMessage(prev => prev + (prev ? '\n\n' : '') + reference);
  };

  const handleQuickSave = (content: string) => {
    setQuickAddContent(content);
    setShowQuickAdd(true);
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getConversationContext = () => {
    return messages.map(m => m.content).join(' ').substring(0, 500);
  };

  return (
    <div className="flex h-full gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Chat with Memory
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMemories(!showMemories)}
              >
                <Sidebar className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] p-3 rounded-lg relative group ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                        
                        {msg.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuickSave(msg.content)}
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message... (memories will be suggested automatically)"
                className="flex-1 min-h-[60px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || loading}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowQuickAdd(true)}
                  variant="outline"
                  size="sm"
                >
                  <Brain className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Memory Panel */}
      {showMemories && (
        <RelevantMemories
          conversationContext={getConversationContext()}
          onMemorySelect={handleMemorySelect}
          onAddMemory={() => setShowQuickAdd(true)}
        />
      )}

      {/* Quick Memory Add Modal */}
      {showQuickAdd && (
        <QuickMemoryAdd
          initialContent={quickAddContent}
          onClose={() => {
            setShowQuickAdd(false);
            setQuickAddContent('');
          }}
          onSave={(memory) => {
            console.log('Memory saved:', memory);
          }}
        />
      )}
    </div>
  );
}