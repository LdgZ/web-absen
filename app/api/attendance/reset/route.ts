import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { classId } = await request.json();

    if (!classId) {
      return NextResponse.json({ error: 'ID Kelas wajib diisi' }, { status: 400 });
    }

    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

    console.log(`Resetting attendance for class ${classId} on ${today}`);

    const result: any = await query(
      'DELETE FROM attendance WHERE class_id = ? AND date = ?',
      [classId, today]
    );

    return NextResponse.json({
      success: true,
      message: `Presensi hari ini untuk kelas tersebut berhasil di-reset.`,
      affectedRows: result.affectedRows
    });
  } catch (error: any) {
    console.error('Error resetting attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal meriset data presensi',
      details: error.message 
    }, { status: 500 });
  }
}
