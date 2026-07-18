"use client";
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useOperations } from '@/context/OperationsContext';

export default function CrowdChart() {
  const { trends } = useOperations();

  return (
    <div className="h-[320px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            domain={[30, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0b1528', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="crowdIndex" 
            stroke="#00AEEF" 
            strokeWidth={2} 
            dot={{ fill: '#00AEEF', r: 4 }}
            name="Crowd Index"
          />
          <Line 
            type="monotone" 
            dataKey="throughput" 
            stroke="#28C76F" 
            strokeWidth={2} 
            dot={{ fill: '#28C76F', r: 4 }}
            name="Throughput %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
