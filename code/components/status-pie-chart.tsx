'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface StatusData {
  [key: string]: any;
  name: string;
  value: number;
}

interface StatusPieChartProps {
  data: StatusData[];
  title?: string;
}

const COLORS = ['#059669', '#D97706', '#DC2626', '#6B7280'];

export function StatusPieChart({ data, title = 'Komposisi Status' }: StatusPieChartProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {COLORS.map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
