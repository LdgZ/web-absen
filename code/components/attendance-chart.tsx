'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartData {
  date: string;
  hadir: number;
  sakit: number;
  alpha: number;
}

interface AttendanceChartProps {
  data: ChartData[];
  title?: string;
}

export function AttendanceChart({ data, title = 'Tren Presensi' }: AttendanceChartProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hadir" fill="#059669" name="Hadir" />
          <Bar dataKey="sakit" fill="#D97706" name="Sakit" />
          <Bar dataKey="alpha" fill="#DC2626" name="Alpha" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
