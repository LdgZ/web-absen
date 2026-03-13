'use client';

import { Card } from '@/components/ui/card';
import { getStatusBadgeColor } from '@/lib/formatters';

interface StudentData {
  id: string;
  nis: string;
  name: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  percentage: number;
}

interface StudentReportTableProps {
  data: StudentData[];
}

export function StudentReportTable({ data }: StudentReportTableProps) {
  return (
    <Card className="border-0 shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NIS</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Hadir</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Sakit</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Izin</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Alpha</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Persentase</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-6 py-3 text-sm text-gray-900">{student.nis}</td>
              <td className="px-6 py-3 text-sm text-gray-900 font-medium">{student.name}</td>
              <td className="px-6 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold">
                  {student.hadir}
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-semibold">
                  {student.sakit}
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {student.izin}
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-semibold">
                  {student.alpha}
                </span>
              </td>
              <td className="px-6 py-3 text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${student.percentage >= 85 ? 'bg-green-100 text-green-700' : student.percentage >= 70 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                  {student.percentage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
