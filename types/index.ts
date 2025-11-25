export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code';
  tags?: string[];
  created_at: string;
  updated_at: string;
}