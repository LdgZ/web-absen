@echo off
chcp 65001 >nul
title Installer Sistem Absensi Sekolah
color 0A

echo ═══════════════════════════════════════════════════════
echo        INSTALLER SISTEM ABSENSI SEKOLAH
echo        One-Click Install ^& Run
echo ═══════════════════════════════════════════════════════
echo.

REM ─── Step 1: Check Node.js ───
echo [1/5] Memeriksa Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ╔══════════════════════════════════════════════╗
    echo  ║  Node.js BELUM terinstall!                   ║
    echo  ║                                              ║
    echo  ║  Silakan download dan install Node.js dari:  ║
    echo  ║  https://nodejs.org/en/download              ║
    echo  ║                                              ║
    echo  ║  Pilih versi LTS ^(v20 atau lebih baru^)       ║
    echo  ║  Setelah install, jalankan script ini lagi.  ║
    echo  ╚══════════════════════════════════════════════╝
    echo.
    echo Mencoba install otomatis via winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Gagal install otomatis. Silakan install manual dari https://nodejs.org
        echo.
        pause
        exit /b 1
    )
    echo Node.js berhasil diinstall! Restart terminal ini dan jalankan script lagi.
    pause
    exit /b 0
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo   ✓ Node.js terdeteksi: %NODE_VER%

REM ─── Step 2: Check MySQL via XAMPP ───
echo.
echo [2/5] Memeriksa MySQL...

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ╔══════════════════════════════════════════════════╗
    echo  ║  MySQL BELUM berjalan!                           ║
    echo  ║                                                  ║
    echo  ║  Buka XAMPP Control Panel dan START:             ║
    echo  ║   ► Apache                                       ║
    echo  ║   ► MySQL                                        ║
    echo  ║                                                  ║
    echo  ║  Setelah MySQL running, tekan ENTER.             ║
    echo  ╚══════════════════════════════════════════════════╝
    echo.
    
    REM Try to start MySQL via XAMPP automatically
    if exist "C:\xampp\mysql\bin\mysqld.exe" (
        echo Mencoba start MySQL otomatis...
        start "" "C:\xampp\xampp-control.exe"
    )
    
    pause
    
    REM Re-check
    tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo MySQL masih belum berjalan. Pastikan XAMPP MySQL sudah START.
        pause
        exit /b 1
    )
)
echo   ✓ MySQL berjalan

REM ─── Step 3: Create Database & Seed ───
echo.
echo [3/5] Membuat database dan tabel...

REM Determine MySQL path
set MYSQL_PATH=mysql
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe

REM Create database
"%MYSQL_PATH%" -u root -e "CREATE DATABASE IF NOT EXISTS sekolah_absensi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   ! Gagal membuat database. Pastikan MySQL berjalan.
    pause
    exit /b 1
)

REM Check if tables exist
"%MYSQL_PATH%" -u root sekolah_absensi -e "SELECT 1 FROM teachers LIMIT 1;" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   Menjalankan init-db.sql...
    "%MYSQL_PATH%" -u root sekolah_absensi < "%~dp0code\scripts\init-db.sql" 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo   ! Peringatan: init-db.sql gagal sebagian. Mungkin tabel sudah ada.
    ) else (
        echo   ✓ Database dan data demo berhasil dibuat
    )
) else (
    echo   ✓ Database sudah ada, skip seed data
)

REM ─── Step 4: Install Dependencies ───
echo.
echo [4/5] Menginstall dependencies (npm install)...
echo   Ini mungkin memakan waktu beberapa menit...

cd /d "%~dp0code"
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   ! npm install gagal. Coba hapus node_modules dan jalankan lagi:
    echo     rd /s /q node_modules
    echo     npm install
    pause
    exit /b 1
)
echo   ✓ Dependencies terinstall

REM ─── Step 5: Start Dev Server ───
echo.
echo ═══════════════════════════════════════════════════════
echo   ✓ Semua siap! Menjalankan server...
echo ═══════════════════════════════════════════════════════
echo.
echo   URL:    http://localhost:3000
echo   Login:  guru@sekolah.com / demo123
echo.
echo   Tekan Ctrl+C untuk menghentikan server.
echo.

call npm run dev
