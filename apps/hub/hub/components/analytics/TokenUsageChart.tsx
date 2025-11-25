'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TokenUsageChartProps {
  timeRange: string;
}

export function TokenUsageChart({ timeRange }: TokenUsageChartProps) {
  const generateData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const inputTokens = Math.floor(Math.random() * 50000) + 10000;
      const outputTokens = Math.floor(Math.random() * 80000) + 20000;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens
      });
    }
    
    return data;
  };

  const data = generateData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: number) => [value.toLocaleString(), '']} />
          <Area 
            type="monotone" 
            dataKey="inputTokens" 
            stackId="1"
            stroke="#3b82f6" 
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Input Tokens"
          />
          <Area 
            type="monotone" 
            dataKey="outputTokens" 
            stackId="1"
            stroke="#10b981" 
            fill="#10b981"
            fillOpacity={0.6}
            name="Output Tokens"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}