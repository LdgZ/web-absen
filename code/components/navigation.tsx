'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hide navigation on login page
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/tutwurihandayani.png" alt="Logo Tut Wuri Handayani" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">SDN Wringinagung 3</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className={`transition ${isActive('/dashboard') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>
              Dashboard
            </Link>
            <Link href="/attendance" className={`transition ${isActive('/attendance') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>
              Presensi
            </Link>
            <Link href="/students" className={`transition ${isActive('/students') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>
              Siswa
            </Link>
            <Link href="/reports" className={`transition ${isActive('/reports') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>
              Laporan
            </Link>
            <Link href="/settings" className={`transition ${isActive('/settings') ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}>
              Pengaturan
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link href="/attendance" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>
              Presensi
            </Link>
            <Link href="/students" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>
              Siswa
            </Link>
            <Link href="/reports" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>
              Laporan
            </Link>
            <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>
              Pengaturan
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
