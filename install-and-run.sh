#!/bin/bash
set -e

echo "═══════════════════════════════════════════════════════"
echo "       INSTALLER SISTEM ABSENSI SEKOLAH"
echo "       One-Click Install & Run"
echo "═══════════════════════════════════════════════════════"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Step 1: Check Node.js ───
echo "[1/5] Memeriksa Node.js..."
if ! command -v node &> /dev/null; then
    echo ""
    echo "  Node.js BELUM terinstall!"
    echo "  Silakan install Node.js v20+ dari: https://nodejs.org"
    echo ""
    echo "  Atau install via package manager:"
    echo "    Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "    Mac: brew install node"
    echo ""
    exit 1
fi
echo "  ✓ Node.js terdeteksi: $(node -v)"

# ─── Step 2: Check MySQL ───
echo ""
echo "[2/5] Memeriksa MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "  MySQL client tidak ditemukan."
    echo "  Install: sudo apt-get install mysql-client mysql-server"
    exit 1
fi

# Check if MySQL is running
if ! mysqladmin ping -u root --silent 2>/dev/null; then
    echo "  MySQL BELUM berjalan!"
    echo "  Start MySQL: sudo systemctl start mysql"
    echo ""
    read -p "  Tekan ENTER setelah MySQL berjalan..."
    
    if ! mysqladmin ping -u root --silent 2>/dev/null; then
        echo "  MySQL masih belum berjalan."
        exit 1
    fi
fi
echo "  ✓ MySQL berjalan"

# ─── Step 3: Create Database & Seed ───
echo ""
echo "[3/5] Membuat database dan tabel..."

mysql -u root -e "CREATE DATABASE IF NOT EXISTS sekolah_absensi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    echo "  ! Gagal membuat database"
    exit 1
}

if ! mysql -u root sekolah_absensi -e "SELECT 1 FROM teachers LIMIT 1;" &>/dev/null; then
    echo "  Menjalankan init-db.sql..."
    mysql -u root sekolah_absensi < "$SCRIPT_DIR/code/scripts/init-db.sql" 2>/dev/null || echo "  ! Warning: init-db.sql may have partially failed"
    echo "  ✓ Database dan data demo berhasil dibuat"
else
    echo "  ✓ Database sudah ada, skip seed data"
fi

# ─── Step 4: Install Dependencies ───
echo ""
echo "[4/5] Menginstall dependencies (npm install)..."
echo "  Ini mungkin memakan waktu beberapa menit..."

cd "$SCRIPT_DIR/code"
npm install || {
    echo "  ! npm install gagal."
    exit 1
}
echo "  ✓ Dependencies terinstall"

# ─── Step 5: Start Dev Server ───
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✓ Semua siap! Menjalankan server..."
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  URL:    http://localhost:3000"
echo "  Login:  guru@sekolah.com / demo123"
echo ""
echo "  Tekan Ctrl+C untuk menghentikan server."
echo ""

npm run dev
