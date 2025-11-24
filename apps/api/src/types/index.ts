export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'contributor' | 'verifier' | 'developer' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
  country?: string;
  city?: string;
  avatar_url?: string;
  email_verified: boolean;
  reputation_score: number;
  total_contributions: number;
  total_verifications: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: 'general' | 'developer' | 'learning' | 'business';
  ai_provider: 'anthropic' | 'openai';
  model_used?: string;
  message_count: number;
  token_count: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: 'note' | 'code' | 'document' | 'snippet' | 'idea';
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}