'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CostAnalysisChartProps {
  timeRange: string;
}

export function CostAnalysisChart({ timeRange }: CostAnalysisChartProps) {
  const generateData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyCost = Math.random() * 5 + 0.5;
      const cumulativeCost = data.length > 0 ? 
        data[data.length - 1].cumulativeCost + dailyCost : 
        dailyCost;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dailyCost: parseFloat(dailyCost.toFixed(2)),
        cumulativeCost: parseFloat(cumulativeCost.toFixed(2))
      });
    }
    
    return data;
  };

  const data = generateData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip formatter={(value: number) => [`$${value}`, '']} />
          <Bar 
            yAxisId="left"
            dataKey="dailyCost" 
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Daily Cost"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="cumulativeCost" 
            stroke="#ef4444"
            strokeWidth={2}
            name="Cumulative Cost"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}