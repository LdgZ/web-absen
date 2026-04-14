import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Presensi SDN Wringinagung 3',
  description: 'Aplikasi presensi sekolah modern dan user-friendly',
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
