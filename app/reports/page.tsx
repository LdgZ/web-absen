'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      // Ensure id is string for Select component
      const mapped = (data || []).map((c: any) => ({
        id: c.id?.toString(),
        name: c.name,
      }));
      setClasses(mapped);
    } catch (error) {
      toast.error('Gagal mengambil data kelas');
    }
  };

  const fetchReport = async () => {
    if (!selectedClass) {
      toast.error('Pilih kelas terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${selectedClass}?month=${month}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      toast.error('Gagal mengambil laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/reports/${selectedClass}/export?month=${month}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-${month}.xlsx`;
      a.click();
      toast.success('Laporan diunduh');
    } catch (error) {
      toast.error('Gagal download laporan');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#059669', '#D97706', '#DC2626', '#6B7280'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laporan Presensi</h1>
          <p className="text-gray-600 mt-2">Analisis dan rekap presensi siswa</p>
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kelas</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReport} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Loading...' : 'Tampilkan Laporan'}
              </Button>
            </div>
          </div>

          {selectedClass && (
            <div className="flex gap-2">
              <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 flex-1">
                <Download className="w-4 h-4" />
                Download Excel
              </Button>
              <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 flex-1">
                <Printer className="w-4 h-4" />
                Cetak
              </Button>
            </div>
          )}
        </Card>

        {/* Charts and Stats */}
        {reportData && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-6 border-0 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Total Hari Masuk</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{reportData.totalDays}</p>
              </Card>
              <Card className="p-6 border-0 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Rata-rata Hadir</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{reportData.averagePresent}%</p>
              </Card>
              <Card className="p-6 border-0 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Total Sakit</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{reportData.statusComposition?.find((s: any) => s.name === 'Sakit')?.value || 0}</p>
              </Card>
              <Card className="p-6 border-0 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Total Alpha</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{reportData.statusComposition?.find((s: any) => s.name === 'Alpha')?.value || 0}</p>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tren Presensi</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.dailyData || []}>
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

              {/* Pie Chart */}
              <Card className="p-6 border-0 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Komposisi Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.statusComposition || []}
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
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Detailed Data Table */}
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
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">%</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.studentData &&
                    reportData.studentData.map((student: any) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-900">{student.nis}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-medium">{student.name}</td>
                        <td className="px-6 py-3 text-center text-sm text-green-600 font-semibold">{student.hadir}</td>
                        <td className="px-6 py-3 text-center text-sm text-orange-600 font-semibold">{student.sakit}</td>
                        <td className="px-6 py-3 text-center text-sm text-blue-600 font-semibold">{student.izin}</td>
                        <td className="px-6 py-3 text-center text-sm text-red-600 font-semibold">{student.alpha}</td>
                        <td className="px-6 py-3 text-center text-sm font-semibold text-gray-900">{student.percentage}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {!reportData && selectedClass && (
          <Card className="p-12 border-0 shadow-sm text-center">
            <p className="text-gray-600">Klik "Tampilkan Laporan" untuk melihat data</p>
          </Card>
        )}
      </div>
    </div>
  );
}
