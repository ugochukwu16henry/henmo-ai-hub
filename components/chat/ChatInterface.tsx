'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Bot, User, Settings, Paperclip } from 'lucide-react';
import api from '@/lib/api';
import { Message } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { ModelSelector } from './ModelSelector';
import { FileUpload } from './FileUpload';

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages?: Message[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  url?: string;
}

export function ChatInterface({ conversationId, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
      tokens_used: 0,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await api.post(`/conversations/${conversationId}/messages`, {
        content: userMessage,
        model: selectedModel,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      const { userMessage: savedUserMsg, assistantMessage } = (response.data as any).data;

      // Replace temp message with real messages
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id),
        savedUserMsg,
        assistantMessage,
      ]);
      
      // Clear uploaded files after sending
      setUploadedFiles([]);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
      alert(error.response?.data?.error?.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Header with Model Selector */}
      <div className="flex items-center justify-between p-4 border-b">
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFileUpload(!showFileUpload)}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Files
        </Button>
      </div>

      {/* File Upload Area */}
      {showFileUpload && (
        <div className="p-4 border-b bg-gray-50">
          <FileUpload
            onFilesUpload={(files) => setUploadedFiles([...uploadedFiles, ...files])}
            uploadedFiles={uploadedFiles}
            onRemoveFile={(fileId) => setUploadedFiles(files => files.filter(f => f.id !== fileId))}
          />
        </div>
      )}
      {/* Messages */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Start a conversation</h3>
                <p className="text-sm text-gray-600">
                  Ask me anything! I&apos;m here to help.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <Card className="mt-4 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={uploadedFiles.length > 0 ? `Ask about ${uploadedFiles.length} file(s)...` : "Type your message... (Shift+Enter for new line)"}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {uploadedFiles.length} file(s) attached • Using {selectedModel}
          </div>
        )}
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {formatRelativeTime(message.created_at)}
        </p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-500">
            <User className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}