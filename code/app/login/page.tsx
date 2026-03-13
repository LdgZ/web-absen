'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('guru@sekolah.com');
  const [password, setPassword] = useState('demo123');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Login gagal');
      }

      toast.success('Login berhasil!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-sm">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Presensi SDN Wringinagung 3</h1>
          <p className="text-gray-600 text-sm mb-6">Masukkan kredensial Anda untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {loading ? 'Sedang login...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200 text-sm text-gray-700">
            <p className="font-semibold mb-1">Demo Account:</p>
            <p>Email: guru@sekolah.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
