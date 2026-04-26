import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    const studentsRes: any = await query('SELECT COUNT(*) as c FROM students');
    const studentCount = Array.isArray(studentsRes) ? studentsRes[0]?.c : 'Error result format';
    
    return NextResponse.json({
      message: "Deployment Success!",
      version: "v3-debug-stats",
      timestamp,
      studentCount,
      db_url_exists: !!process.env.DATABASE_URL
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "API Running but DB Error",
      version: "v3-debug-stats",
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
