# Setup Sistem Absensi Sekolah dengan XAMPP

Panduan lengkap setup aplikasi di komputer lokal menggunakan XAMPP.

## Prasyarat

- XAMPP (MySQL + Apache) - download dari https://www.apachefriends.org/
- Node.js 18+ - download dari https://nodejs.org/
- Text editor (VS Code recommended)

## Langkah 1: Jalankan MySQL

1. Buka XAMPP Control Panel
2. Klik tombol **"Start"** untuk MySQL
3. Tunggu sampai status menjadi **"Running"** (warna hijau)

MySQL sekarang berjalan di `localhost:3306`

## Langkah 2: Buat Database

### Metode A: Menggunakan phpMyAdmin (Lebih Mudah)

1. Buka browser: http://localhost/phpmyadmin
2. Klik tab **"SQL"** di bagian atas
3. Copy-paste seluruh kode dari file `scripts/init-db.sql`
4. Klik tombol **"Go"** atau **"Execute"**

Database `sekolah_absensi` sekarang sudah dibuat dengan tabel dan data demo.

### Metode B: Menggunakan Command Line

Buka command line/terminal dan jalankan:

\`\`\`bash
mysql -u root < scripts/init-db.sql
\`\`\`

Password MySQL XAMPP default: kosong (tinggal tekan Enter)

## Langkah 3: Setup Project

1. Buka folder project di command line
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

## Langkah 4: Konfigurasi Environment

Buat file `.env.local` di root folder project:

\`\`\`
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sekolah_absensi
JWT_SECRET=your-secret-key-12345
\`\`\`

**Penjelasan:**
- `DB_HOST`: Server MySQL (localhost untuk XAMPP)
- `DB_USER`: Username MySQL (default XAMPP: root)
- `DB_PASSWORD`: Password MySQL (default XAMPP: kosong)
- `DB_NAME`: Nama database yang dibuat tadi
- `JWT_SECRET`: Kunci untuk authentication

## Langkah 5: Jalankan Development Server

\`\`\`bash
npm run dev
\`\`\`

Server akan berjalan di: **http://localhost:3000**

## Langkah 6: Login

Buka http://localhost:3000 di browser

**Demo Account:**
- Email: `guru@sekolah.com`
- Password: `demo123`

Akun ini sudah ada di database dari script `init-db.sql`

---

## Penjelasan Fitur

### Dashboard
- Statistik siswa hari ini (hadir/sakit/izin/alpha)
- Grafik kehadiran 7 hari terakhir
- Total siswa dan persentase kehadiran

### Absensi
1. Pilih kelas dari dropdown
2. Tandai status setiap siswa (Hadir/Sakit/Izin/Alpha)
3. Gunakan tombol "Tandai Semua" untuk shortcut
4. Klik "Simpan Absensi"

### Siswa
- Lihat daftar siswa per kelas
- Tambah siswa baru
- Edit data siswa
- Hapus siswa

### Laporan
- Pilih kelas dan bulan
- Lihat chart kehadiran dan pie chart status
- Lihat tabel detail per siswa dengan persentase kehadiran

---

## Troubleshooting

### Error: MySQL Connection Refused

**Masalah:** "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Solusi:**
1. Buka XAMPP Control Panel
2. Pastikan MySQL sudah di-click "Start" dan status "Running"
3. Cek apakah port 3306 tidak terpakai program lain

### Error: Unknown Database 'sekolah_absensi'

**Masalah:** Database tidak ditemukan saat aplikasi start

**Solusi:**
1. Buka phpMyAdmin: http://localhost/phpmyadmin
2. Cek apakah database `sekolah_absensi` sudah ada di sidebar kiri
3. Jika belum, jalankan script `scripts/init-db.sql` lagi

### Error: Cannot Find Module 'mysql2'

**Masalah:** Dependency tidak terinstall

**Solusi:**
\`\`\`bash
npm install
npm run dev
\`\`\`

### Halaman Blank atau Error Saat Login

**Solusi:**
1. Buka Developer Tools (F12 di browser)
2. Lihat tab "Console" untuk error details
3. Restart dev server: Ctrl+C lalu `npm run dev`
4. Clear cache browser: Ctrl+Shift+Delete

### Port 3000 Sudah Dipakai

**Solusi:**
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

Akses di http://localhost:3001

---

## Backup & Restore Database

### Backup

\`\`\`bash
mysqldump -u root sekolah_absensi > backup_$(date +%Y%m%d).sql
\`\`\`

### Restore

\`\`\`bash
mysql -u root sekolah_absensi < backup_20240115.sql
\`\`\`

---

## Build untuk Production

\`\`\`bash
npm run build
npm start
\`\`\`

Aplikasi siap deploy ke hosting yang support Node.js:
- Vercel (recommended)
- Render.com
- Railway.app
- Heroku

---

## Struktur Folder

\`\`\`
.
├── app/
│   ├── api/              # API routes
│   ├── login/            # Halaman login
│   ├── dashboard/        # Dashboard
│   ├── attendance/       # Form absensi
│   ├── students/         # Manajemen siswa
│   └── reports/          # Laporan
├── components/           # React components
├── lib/
│   └── db.ts            # Database connection
├── public/               # Static files
├── scripts/
│   └── init-db.sql      # Database schema
└── package.json
\`\`\`

---

## Bantuan Lebih Lanjut

Jika mengalami masalah:

1. Cek console browser (F12)
2. Cek terminal/command line untuk error messages
3. Pastikan MySQL sudah running
4. Pastikan file `.env.local` sudah benar
5. Cek di phpMyAdmin apakah database dan tabel sudah ada

Semoga sukses!
