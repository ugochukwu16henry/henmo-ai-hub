'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversationTrendsChartProps {
  timeRange: string;
}

export function ConversationTrendsChart({ timeRange }: ConversationTrendsChartProps) {
  const generateData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        conversations: Math.floor(Math.random() * 20) + 5,
        messages: Math.floor(Math.random() * 100) + 20
      });
    }
    
    return data;
  };

  const data = generateData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="conversations" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Conversations"
          />
          <Line 
            type="monotone" 
            dataKey="messages" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Messages"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}