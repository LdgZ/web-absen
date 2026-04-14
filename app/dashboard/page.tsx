'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
const WeeklyStatsChart = dynamic(() => import('@/components/WeeklyStatsChart'), { ssr: false });
import { Users, CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalStudents: number;
  presentToday: number;
  sickToday: number;
  izinToday: number;
  alphaToday: number;
  attendancePercentage: number;
  weeklyData: Array<{ day: string; hadir: number; sakit: number; izin: number; alpha: number }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    presentToday: 0,
    sickToday: 0,
    izinToday: 0,
    alphaToday: 0,
    attendancePercentage: 0,
    weeklyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Total Siswa</p>
            <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Hadir Hari Ini</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.presentToday}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Sakit Hari Ini</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.sickToday}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Izin Hari Ini</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.izinToday}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm">Alpha Hari Ini</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.alphaToday}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => router.push('/attendance')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          >
            Presensi Hari Ini
          </Button>
          <Button
            onClick={() => router.push('/students')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
          >
            Kelola Siswa
          </Button>
          <Button
            onClick={() => router.push('/reports')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
          >
            Laporan
          </Button>
        </div>

        {/* Charts */}
        <Card className="p-6 border-0 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Minggu Ini</h2>
          <WeeklyStatsChart data={stats.weeklyData} />
        </Card>
      </div>
    </div>
  );
}
