'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, XCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  nis: string;
  name: string;
  parentPhone: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA';
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/classes/${selectedClass}/students`);
      const data = await response.json();
      setStudents(data);

      // Fetch today's attendance
      const attendanceResponse = await fetch(`/api/attendance/today/${selectedClass}`);
      const attendanceData = await attendanceResponse.json();

      const attendanceMap = new Map<string, AttendanceRecord>();
      if (Array.isArray(attendanceData)) {
        attendanceData.forEach((record: any) => {
          // DB returns snake_case fields and lowercase status
          const studentId = (record.id || record.student_id || record.studentId)?.toString();
          const rawStatus = (record.status || 'hadir').toUpperCase();
          if (studentId) {
            attendanceMap.set(studentId, { studentId, status: rawStatus as any });
          }
        });
      }

      setAttendance(attendanceMap);
    } catch (error) {
      toast.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA') => {
    const newAttendance = new Map(attendance);
    newAttendance.set(studentId, { studentId, status });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedClass) {
      toast.error('Pilih kelas terlebih dahulu');
      return;
    }

    setSaving(true);
    try {
      const records = Array.from(attendance.values());
      const response = await fetch('/api/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          date: new Date().toISOString().split('T')[0],
          records,
        }),
      });

      if (!response.ok) throw new Error('Gagal menyimpan');

      const result = await response.json();
      const smsMsg = result.smsSent > 0 ? ` (${result.smsSent} SMS terkirim)` : '';
      toast.success(`Presensi tersimpan!${smsMsg}`);
      fetchStudents();
    } catch (error) {
      toast.error('Gagal menyimpan presensi');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAll = (status: 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPHA') => {
    const newAttendance = new Map<string, AttendanceRecord>();
    students.forEach((student) => {
      newAttendance.set(student.id, { studentId: student.id, status });
    });
    setAttendance(newAttendance);
    toast.success(`Semua siswa ditandai ${status}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'HADIR':
        return 'bg-green-50 border-green-200';
      case 'SAKIT':
        return 'bg-orange-50 border-orange-200';
      case 'IZIN':
        return 'bg-blue-50 border-blue-200';
      case 'ALPHA':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'HADIR':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'SAKIT':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'ALPHA':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Presensi Hari Ini</h1>
          <p className="text-gray-600 mt-2">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Class Selection */}
        <Card className="p-6 border-0 shadow-sm mb-6">
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
        </Card>

        {/* Quick Actions */}
        {selectedClass && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <Button
              onClick={() => handleMarkAll('HADIR')}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              Tandai Semua Hadir
            </Button>
            <Button
              onClick={() => handleMarkAll('SAKIT')}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
            >
              Tandai Semua Sakit
            </Button>
            <Button
              onClick={() => handleMarkAll('IZIN')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Tandai Semua Izin
            </Button>
            <Button
              onClick={() => handleMarkAll('ALPHA')}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Tandai Semua Alpha
            </Button>
          </div>
        )}

        {/* Student List */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedClass && students.length > 0 ? (
          <div className="space-y-2 mb-6">
            {students.map((student) => {
              const record = attendance.get(student.id);
              const status = record?.status || 'HADIR';

              return (
                <Card key={student.id} className={`p-4 border cursor-pointer transition ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">NIS: {student.nis}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      {getStatusIcon(status)}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(student.id, 'HADIR')}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${status === 'HADIR' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                          Hadir
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'SAKIT')}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${status === 'SAKIT' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                          Sakit
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'IZIN')}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${status === 'IZIN' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                          Izin
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'ALPHA')}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${status === 'ALPHA' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                          Alpha
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          selectedClass && <p className="text-center text-gray-600">Tidak ada siswa di kelas ini</p>
        )}

        {/* Save Button */}
        {selectedClass && students.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Menyimpan...' : 'Simpan Presensi'}
          </Button>
        )}
      </div>
    </div>
  );
}
