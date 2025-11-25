'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, DollarSign, TrendingUp, Clock } from 'lucide-react';

interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens?: TokenUsage;
}

interface TokenUsageChartProps {
  messages: Message[];
  provider: 'openai' | 'anthropic';
  model: string;
}

export function TokenUsageChart({ messages, provider, model }: TokenUsageChartProps) {
  const calculateTotals = () => {
    return messages.reduce(
      (acc, message) => {
        if (message.tokens) {
          acc.input_tokens += message.tokens.input_tokens;
          acc.output_tokens += message.tokens.output_tokens;
          acc.total_tokens += message.tokens.total_tokens;
          acc.estimated_cost += message.tokens.estimated_cost;
        }
        return acc;
      },
      { input_tokens: 0, output_tokens: 0, total_tokens: 0, estimated_cost: 0 }
    );
  };

  const totals = calculateTotals();
  const maxTokens = getModelMaxTokens(model);
  const usagePercentage = (totals.total_tokens / maxTokens) * 100;

  const getTokenCost = (tokens: number, type: 'input' | 'output') => {
    const rates = getTokenRates(provider, model);
    return type === 'input' ? 
      (tokens / 1000) * rates.input : 
      (tokens / 1000) * rates.output;
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold">{totals.total_tokens.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Input</span>
            </div>
            <div className="text-2xl font-bold">{totals.input_tokens.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Output</span>
            </div>
            <div className="text-2xl font-bold">{totals.output_tokens.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Est. Cost</span>
            </div>
            <div className="text-2xl font-bold">${totals.estimated_cost.toFixed(4)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Token Usage</span>
            <Badge variant="outline">
              {model} ({provider})
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {totals.total_tokens.toLocaleString()}</span>
              <span>Limit: {maxTokens.toLocaleString()}</span>
            </div>
            <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
            <div className="text-xs text-gray-500">
              {usagePercentage.toFixed(1)}% of context window used
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Message Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messages.map((message, index) => (
              message.tokens && (
                <div key={message.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                      {message.role}
                    </Badge>
                    <span className="text-sm">Message {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{message.tokens.total_tokens} tokens</span>
                    <span className="text-green-600">
                      ${message.tokens.estimated_cost.toFixed(4)}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getModelMaxTokens(model: string): number {
  const limits: Record<string, number> = {
    'gpt-4': 8192,
    'gpt-4-turbo': 128000,
    'gpt-3.5-turbo': 4096,
    'claude-3-opus': 200000,
    'claude-3-sonnet': 200000,
    'claude-3-haiku': 200000
  };
  return limits[model] || 8192;
}

function getTokenRates(provider: string, model: string) {
  const rates: Record<string, Record<string, { input: number; output: number }>> = {
    openai: {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    },
    anthropic: {
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 }
    }
  };
  
  return rates[provider]?.[model] || { input: 0.01, output: 0.03 };
}