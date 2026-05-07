import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

    console.log(`Resetting all attendance for all classes on ${today}`);

    const result: any = await query(
      'DELETE FROM attendance WHERE date = ?',
      [today]
    );

    return NextResponse.json({
      success: true,
      message: `Seluruh presensi hari ini berhasil di-reset.`,
      affectedRows: result.affectedRows
    });
  } catch (error: any) {
    console.error('Error resetting all attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal meriset seluruh data presensi',
      details: error.message 
    }, { status: 500 });
  }
}
