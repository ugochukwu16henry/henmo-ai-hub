'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MemoryGrowthChartProps {
  timeRange: string;
}

export function MemoryGrowthChart({ timeRange }: MemoryGrowthChartProps) {
  const generateData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    let totalMemories = 50;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const newMemories = Math.floor(Math.random() * 5);
      totalMemories += newMemories;
      
      const codeMemories = Math.floor(totalMemories * 0.4);
      const noteMemories = totalMemories - codeMemories;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalMemories,
        codeMemories,
        noteMemories,
        newMemories
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
            dataKey="totalMemories" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            name="Total Memories"
          />
          <Line 
            type="monotone" 
            dataKey="codeMemories" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Code Memories"
          />
          <Line 
            type="monotone" 
            dataKey="noteMemories" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Note Memories"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}