import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    await query('SELECT 1');
    
    // Check what tables exist
    let tables: any = [];
    try {
      tables = await query('SHOW TABLES');
    } catch (e) {}

    // Check student count
    let studentCount = 0;
    try {
      const result: any = await query('SELECT COUNT(*) as c FROM students');
      studentCount = Array.isArray(result) ? result[0]?.c : 0;
    } catch (e) {}

    // Check attendance count
    let attendanceCount = 0;
    try {
      const result: any = await query('SELECT COUNT(*) as c FROM attendance');
      attendanceCount = Array.isArray(result) ? result[0]?.c : 0;
    } catch (e) {}

    return NextResponse.json({ 
      status: 'ok',
      env: process.env.DATABASE_URL ? 'cloud-url' : 'individual-vars',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'sekolah_absensi',
      tables: Array.isArray(tables) ? tables.map((t: any) => Object.values(t)[0]) : [],
      studentCount,
      attendanceCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
