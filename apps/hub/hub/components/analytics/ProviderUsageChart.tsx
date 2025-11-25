'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ProviderUsageChartProps {
  timeRange: string;
}

export function ProviderUsageChart({ timeRange }: ProviderUsageChartProps) {
  const pieData = [
    { name: 'OpenAI GPT-4', value: 45, color: '#3b82f6' },
    { name: 'Anthropic Claude', value: 35, color: '#10b981' },
    { name: 'OpenAI GPT-3.5', value: 20, color: '#f59e0b' }
  ];

  const barData = [
    { provider: 'GPT-4', conversations: 156, tokens: 2450000, cost: 45.67 },
    { provider: 'Claude-3', conversations: 98, tokens: 1890000, cost: 28.45 },
    { provider: 'GPT-3.5', tokens: 890000, conversations: 67, cost: 12.34 }
  ];

  return (
    <div className="space-y-6">
      {/* Usage Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Usage Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Provider Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#3b82f6" name="Conversations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Provider Stats */}
      <div className="grid grid-cols-3 gap-4">
        {barData.map((provider) => (
          <div key={provider.provider} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg">{provider.provider}</h4>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conversations:</span>
                <span className="font-medium">{provider.conversations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tokens:</span>
                <span className="font-medium">{provider.tokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cost:</span>
                <span className="font-medium">${provider.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}