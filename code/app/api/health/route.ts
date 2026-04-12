import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Simple query to keep connection alive
    await query('SELECT 1');
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection is alive',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
