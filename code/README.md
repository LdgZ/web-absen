# Sistem Absensi Sekolah

Aplikasi web untuk mengelola absensi siswa sekolah. Dibangun dengan Next.js dan MySQL.

## Setup dengan XAMPP

### 1. Persiapan

Pastikan sudah install:
- XAMPP (MySQL + Apache)
- Node.js 18+
- Git

### 2. Jalankan MySQL

Buka XAMPP Control Panel:
- Klik "Start" pada MySQL
- Tunggu sampai berstatus "Running"

### 3. Buat Database

Buka phpMyAdmin: http://localhost/phpmyadmin

Eksekusi SQL ini di tab SQL:
\`\`\`sql
CREATE DATABASE sekolah_absensi;
USE sekolah_absensi;
\`\`\`

Kemudian import file `scripts/init-db.sql`:
- Klik database `sekolah_absensi`
- Tab "Import"
- Pilih `scripts/init-db.sql`
- Klik "Go"

Atau via command line:
\`\`\`bash
mysql -u root -p sekolah_absensi < scripts/init-db.sql
\`\`\`

(Password MySQL default XAMPP: kosong, jadi tinggal tekan Enter)

### 4. Setup Project

Clone atau download project ini, lalu:

\`\`\`bash
cd sekolah-absensi
npm install
\`\`\`

### 5. Setup Environment

Buat file `.env.local`:
\`\`\`
DATABASE_URL="mysql://root@localhost:3306/sekolah_absensi"
JWT_SECRET="your-secret-key-12345"
\`\`\`

Selesai! Password MySQL XAMPP biasanya kosong, jadi hanya perlu username `root`.

### 6. Jalankan Project

\`\`\`bash
npm run dev
\`\`\`

Buka browser: http://localhost:3000

### 7. Login Demo

Akun default sudah tersedia di database:
- **Email**: guru@sekolah.com
- **Password**: demo123

## Fitur

- Login guru
- Input absensi harian per kelas
- Manajemen data siswa (tambah/edit/hapus)
- Laporan absensi dengan chart
- Statistik di dashboard

## Menu Utama

1. **Dashboard** - Lihat statistik hari ini
2. **Absensi** - Catat kehadiran siswa
3. **Siswa** - Kelola data siswa
4. **Laporan** - Lihat riwayat absensi

## API Endpoints

\`\`\`
GET    /api/dashboard/stats          - Statistik dashboard
POST   /api/attendance/save          - Simpan absensi
GET    /api/attendance/today/:id     - Absensi hari ini
GET    /api/students                 - Daftar siswa
POST   /api/students                 - Tambah siswa
PUT    /api/students/:id             - Edit siswa
DELETE /api/students/:id             - Hapus siswa
GET    /api/reports/:classId         - Laporan kelas
\`\`\`

## Struktur Folder

\`\`\`
.
├── app/
│   ├── api/              # API routes
│   ├── login/            # Login page
│   ├── dashboard/        # Dashboard page
│   ├── attendance/       # Attendance form
│   ├── students/         # Student management
│   └── reports/          # Reports page
├── components/           # React components
├── lib/                  # Utilities
├── public/               # Static files
└── scripts/
    └── init-db.sql       # Database schema
\`\`\`

## Troubleshooting

### MySQL tidak bisa diakses
- Pastikan MySQL sudah di-start di XAMPP Control Panel
- Default password XAMPP: kosong (tinggal Enter)
- Default username: root

### Database tidak ditemukan
- Pastikan file `scripts/init-db.sql` sudah di-import
- Buka phpMyAdmin dan cek apakah database `sekolah_absensi` sudah ada

### Halaman blank/error
- Restart development server: `Ctrl+C` lalu `npm run dev`
- Clear cache browser: `Ctrl+Shift+Delete`
- Cek console browser (F12) untuk error details

### Module not found
\`\`\`bash
npm install
npm run dev
\`\`\`

### Error koneksi database saat login
Pastikan di `.env.local`:
\`\`\`
DATABASE_URL="mysql://root@localhost:3306/sekolah_absensi"
\`\`\`

Sesuaikan username/password sesuai konfigurasi XAMPP Anda.

## Buat Database Backup

\`\`\`bash
mysqldump -u root sekolah_absensi > backup.sql
\`\`\`

## Restore Database Backup

\`\`\`bash
mysql -u root sekolah_absensi < backup.sql
\`\`\`

## Testing API

Gunakan Postman atau curl untuk test API:

\`\`\`bash
# Get dashboard stats
curl http://localhost:3000/api/dashboard/stats

# Get students
curl http://localhost:3000/api/students
\`\`\`

## Deploy

Untuk production, upload ke hosting yang support Node.js atau gunakan:
- Vercel
- Render
- Railway
- Heroku

Jangan lupa update `DATABASE_URL` sesuai database production Anda.

## Lisensi

MIT
\`\`\`

\`\`\`
.env.example
\`\`\`
DATABASE_URL="mysql://root@localhost:3306/sekolah_absensi"
JWT_SECRET="your-secret-key-here"
