import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationResult, ConfidenceIntervals } from '../types';
import { formatDate } from '../utils/dateUtils';

interface SimulationChartProps {
  results: SimulationResult[];
  confidenceIntervals: ConfidenceIntervals;
}

export function SimulationChart({ results, confidenceIntervals }: SimulationChartProps) {
  const chartData = results.map(result => ({
    ...result,
    formattedDate: formatDate(result.endDate)
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, bottom: 70 }}>
          <XAxis 
            dataKey="formattedDate"
            angle={-45}
            textAnchor="end"
            height={70}
            interval={Math.floor(results.length / 10)}
            label={{ 
              value: 'Project Completion Date', 
              position: 'bottom', 
              offset: 50 
            }}
          />
          <YAxis 
            label={{ 
              value: 'Frequency', 
              angle: -90, 
              position: 'insideLeft',
              offset: 10
            }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} occurrences`, 'Frequency']}
            labelFormatter={(label: string) => `Completion: ${label}`}
          />
          <Bar dataKey="frequency" fill="#6366f1" />
          <ReferenceLine 
            x={formatDate(confidenceIntervals.p30.date)}
            stroke="#ec4899"
            strokeWidth={2} 
            label={{ 
              value: `30% - ${formatDate(confidenceIntervals.p30.date)}`,
              position: "top",
              fill: "#ec4899",
              fontSize: 10,
              dy: -5
            }}
          />
          <ReferenceLine 
            x={formatDate(confidenceIntervals.p70.date)}
            stroke="#0d9488"
            strokeWidth={2} 
            label={{ 
              value: `70% - ${formatDate(confidenceIntervals.p70.date)}`,
              position: "top",
              fill: "#0d9488",
              fontSize: 10,
              dy: -20
            }}
          />
          <ReferenceLine 
            x={formatDate(confidenceIntervals.p90.date)}
            stroke="#d97706"
            strokeWidth={2} 
            label={{ 
              value: `90% - ${formatDate(confidenceIntervals.p90.date)}`,
              position: "top",
              fill: "#d97706",
              fontSize: 10,
              dy: -35
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}