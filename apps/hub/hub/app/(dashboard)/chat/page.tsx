'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Archive } from 'lucide-react';
import api from '@/lib/api';
import { Conversation } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations?limit=50');
      const convs = response.data.data;
      setConversations(convs);
      
      // Select first conversation if available
      if (convs.length > 0 && !selectedConversation) {
        setSelectedConversation(convs[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      setMessages(response.data.data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      const response = await api.post('/conversations', {
        title: 'New Conversation',
        mode: 'general',
      });
      const newConv = response.data.data;
      setConversations([newConv, ...conversations]);
      setSelectedConversation(newConv.id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] space-x-4">
        {/* Sidebar */}
        <Card className="w-80 p-4">
          <Button onClick={handleNewConversation} className="mb-4 w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>

          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center text-sm text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center text-sm text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {conv.is_archived ? (
                        <Archive className="h-4 w-4" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                      <span className="flex-1 truncate font-medium">{conv.title}</span>
                    </div>
                    <p className="mt-1 text-xs opacity-70">
                      {formatRelativeTime(conv.updated_at)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedConversation ? (
            <ChatInterface
              conversationId={selectedConversation}
              initialMessages={messages}
            />
          ) : (
            <Card className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
                <p className="text-sm text-gray-600">
                  Select a conversation or create a new one
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}