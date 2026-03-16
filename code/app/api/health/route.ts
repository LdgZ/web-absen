import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const start = Date.now();
    const result: any = await query('SELECT 1 + 1 AS solution');
    const end = Date.now();

    if (result && result[0].solution === 2) {
      return NextResponse.json({
        status: 'ok',
        database: 'connected',
        latency: `${end - start}ms`,
        env: process.env.DATABASE_URL ? 'production (Aiven)' : 'local',
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Unexpected query result',
    }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      details: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
      }
    }, { status: 500 });
  }
}
