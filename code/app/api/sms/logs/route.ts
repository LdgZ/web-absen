import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    try {
      const rows: any = await query('SELECT id, phone, message, status, provider, response, sent_at FROM sms_logs ORDER BY sent_at DESC LIMIT ?', [limit]);
      return NextResponse.json({ logs: rows || [] });
    } catch (e) {
      // If DB table doesn't exist or query fails, return empty logs
      console.warn('sms logs query failed', e);
      return NextResponse.json({ logs: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ logs: [], error: error?.message || String(error) }, { status: 500 });
  }
}
