'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  nis: string;
  name: string;
  classId: string;
  className: string;
  parentPhone: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nis: '',
    name: '',
    classId: '',
    parentPhone: '',
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  
  // Class management states
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classFormData, setClassFormData] = useState({ name: '' });

  useEffect(() => {
    fetchClasses();
    fetchStudents();
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast.error('Gagal mengambil data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nis || !formData.name || !formData.classId) {
      toast.error('Isi semua kolom yang wajib');
      return;
    }

    try {
      const url = editingId ? `/api/students/${editingId}` : '/api/students';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal menyimpan');

      toast.success(editingId ? 'Siswa diperbarui' : 'Siswa ditambahkan');
      setShowForm(false);
      setEditingId(null);
      setFormData({ nis: '', name: '', classId: '', parentPhone: '' });
      fetchStudents();
    } catch (error) {
      toast.error('Gagal menyimpan siswa');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus siswa ini?')) return;

    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus');
      toast.success('Siswa dihapus');
      fetchStudents();
    } catch (error) {
      toast.error('Gagal menghapus siswa');
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      nis: student.nis,
      name: student.name,
      classId: student.classId,
      parentPhone: student.parentPhone,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleExport = () => {
    // Simple CSV export from client-side data
    let csv = '\uFEFF'; // BOM for Excel
    csv += 'NIS,Nama,Kelas,No. Telepon Orang Tua\n';
    students.forEach((s) => {
      const className = classes.find((c) => c.id === s.classId)?.name || s.classId;
      csv += `"${s.nis}","${s.name}","${className}","${s.parentPhone}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'siswa.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data siswa diexport');
  };

  // Helper to get class name from classId
  const getClassName = (classId: string) => {
    return classes.find((c) => c.id === classId)?.name || classId;
  };

  const handleSaveClass = async () => {
    if (!classFormData.name) {
      toast.error('Nama kelas wajib diisi');
      return;
    }
    try {
      const url = editingClassId ? `/api/classes/${editingClassId}` : '/api/classes';
      const method = editingClassId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classFormData),
      });
      if (!response.ok) throw new Error('Gagal menyimpan kelas');
      toast.success(editingClassId ? 'Kelas diperbarui' : 'Kelas ditambahkan');
      setEditingClassId(null);
      setClassFormData({ name: '' });
      fetchClasses();
    } catch (error) {
      toast.error('Gagal menyimpan kelas');
    }
  };

  const handleDeleteClass = async (id: string, name: string) => {
    if (!confirm(`Hapus kelas ${name} beserta seluruh siswanya secara permanen?`)) return;
    try {
      const response = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus kelas');
      toast.success('Kelas dihapus');
      if (selectedClassFilter === id) setSelectedClassFilter('all');
      fetchClasses();
      fetchStudents(); // refresh students as they might have been deleted
    } catch (error) {
      toast.error('Gagal menghapus kelas');
    }
  };

  const filteredStudents = selectedClassFilter === 'all' 
    ? students 
    : students.filter(s => s.classId === selectedClassFilter);

  // Group sorting logical helper
  const sortClasses = (a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name, undefined, {numeric: true});

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Siswa</h1>
            <p className="text-gray-600 mt-2">Total: {students.length} siswa</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => setShowClassModal(true)} className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
              Kelola Kelas
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Siswa
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <Card className="p-6 border-0 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingId ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
                <Input
                  type="text"
                  placeholder="12345"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Siswa</label>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kelas (Ubah untuk Pindah / Kenaikan Kelas)
                </label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon Orang Tua</label>
                <Input
                  type="tel"
                  placeholder="628123456789"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                Simpan
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ nis: '', name: '', classId: '', parentPhone: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 flex-1"
              >
                Batal
              </Button>
            </div>
          </Card>
        )}

        {/* Class Management Modal */}
        {showClassModal && (
          <Card className="p-6 border-0 shadow-lg mb-8 bg-orange-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Kelola Daftar Kelas</h2>
              <Button variant="ghost" onClick={() => { setShowClassModal(false); setEditingClassId(null); setClassFormData({name: ''}); }}>Tutup</Button>
            </div>
            
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="Nama Kelas (Misal: 1-A)" 
                value={classFormData.name}
                onChange={(e) => setClassFormData({ name: e.target.value })}
              />
              <Button onClick={handleSaveClass} className="bg-orange-600 hover:bg-orange-700 text-white">
                {editingClassId ? 'Update' : 'Tambah Baru'}
              </Button>
              {editingClassId && (
                <Button variant="outline" onClick={() => { setEditingClassId(null); setClassFormData({name: ''}); }}>Batal Edit</Button>
              )}
            </div>

            <div className="bg-white rounded-md border p-4 max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {[...classes].sort(sortClasses).map(cls => (
                    <tr key={cls.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium">{cls.name}</td>
                      <td className="py-2 px-2 text-right">
                        <button onClick={() => { setEditingClassId(cls.id); setClassFormData({name: cls.name}); }} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button onClick={() => handleDeleteClass(cls.id, cls.name)} className="text-red-600 hover:text-red-800">Hapus</button>
                      </td>
                    </tr>
                  ))}
                  {classes.length === 0 && <tr><td className="py-2 px-2 text-gray-500">Belum ada kelas</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Class Filter Tabs */}
        {!loading && classes.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              onClick={() => setSelectedClassFilter('all')} 
              variant={selectedClassFilter === 'all' ? 'default' : 'outline'}
              className={selectedClassFilter === 'all' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white'}
            >
              Semua Kelas
            </Button>
            {[...classes].sort(sortClasses).map(cls => (
              <Button 
                key={cls.id} 
                onClick={() => setSelectedClassFilter(cls.id)}
                variant={selectedClassFilter === cls.id ? 'default' : 'outline'}
                className={selectedClassFilter === cls.id ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white'}
              >
                Kelas {cls.name}
              </Button>
            ))}
          </div>
        )}

        {/* Student Table */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card className="border-0 shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NIS</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kelas</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">No. Telepon</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-sm text-gray-900">{student.nis}</td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">{student.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{student.className || getClassName(student.classId)}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{student.parentPhone}</td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada siswa di kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
