'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, FileText, Code, Plus, Eye } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags: string[];
  created_at: string;
}

interface RelevantMemoriesProps {
  conversationContext: string;
  onMemorySelect: (memory: Memory) => void;
  onAddMemory: () => void;
}

export function RelevantMemories({ conversationContext, onMemorySelect, onAddMemory }: RelevantMemoriesProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [suggestions, setSuggestions] = useState<Memory[]>([]);

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    findRelevantMemories();
  }, [conversationContext, memories]);

  const loadMemories = () => {
    const saved = localStorage.getItem('memories');
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  };

  const findRelevantMemories = () => {
    if (!conversationContext) return;

    const keywords = conversationContext.toLowerCase().split(' ');
    const relevant = memories.filter(memory => {
      const searchText = `${memory.title} ${memory.content} ${memory.tags.join(' ')}`.toLowerCase();
      return keywords.some(keyword => 
        keyword.length > 3 && searchText.includes(keyword)
      );
    }).slice(0, 5);

    setSuggestions(relevant);
  };

  const insertMemoryReference = (memory: Memory) => {
    onMemorySelect(memory);
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4" />
          Relevant Memories
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-4 space-y-3">
            {suggestions.length > 0 ? (
              <>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suggested
                </div>
                {suggestions.map((memory) => (
                  <div
                    key={memory.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => insertMemoryReference(memory)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {memory.type === 'code' ? (
                          <Code className="w-3 h-3 text-blue-500" />
                        ) : (
                          <FileText className="w-3 h-3 text-green-500" />
                        )}
                        <span className="text-sm font-medium line-clamp-1">
                          {memory.title}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {memory.content}
                    </p>
                    
                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {memory.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {memory.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{memory.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No relevant memories found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Continue chatting to get suggestions
                </p>
              </div>
            )}
            
            <Button
              onClick={onAddMemory}
              variant="outline"
              size="sm"
              className="w-full mt-4"
            >
              <Plus className="w-3 h-3 mr-2" />
              Add Memory
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}