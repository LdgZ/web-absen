'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReportSummaryProps {
  totalDays: number;
  averagePresent: number;
  totalSick: number;
  totalAlpha: number;
}

export function ReportSummary({
  totalDays,
  averagePresent,
  totalSick,
  totalAlpha,
}: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 border-0 shadow-sm">
        <p className="text-gray-600 text-sm font-medium">Total Hari Masuk</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">{totalDays}</p>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Rata-rata Hadir</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{averagePresent}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <p className="text-gray-600 text-sm font-medium">Total Sakit</p>
        <p className="text-3xl font-bold text-orange-600 mt-2">{totalSick}</p>
      </Card>

      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Alpha</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{totalAlpha}</p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-600 opacity-20" />
        </div>
      </Card>
    </div>
  );
}
