import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'ID Siswa wajib diisi' }, { status: 400 });
    }

    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

    console.log(`Deleting attendance for student ${studentId} on ${today}`);

    const result: any = await query(
      'DELETE FROM attendance WHERE student_id = ? AND date = ?',
      [studentId, today]
    );

    return NextResponse.json({
      success: true,
      message: `Presensi siswa berhasil dihapus.`,
      affectedRows: result.affectedRows
    });
  } catch (error: any) {
    console.error('Error deleting student attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Gagal menghapus data presensi',
      details: error.message 
    }, { status: 500 });
  }
}
