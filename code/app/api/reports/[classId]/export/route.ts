import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    // Get class name
    const classResult = await query('SELECT name FROM classes WHERE id = ?', [classId]);
    const className = Array.isArray(classResult) && classResult.length > 0 ? (classResult[0] as any).name : 'Unknown Class';

    // Get per-student data
    const studentData = await query(`
      SELECT
        s.id,
        s.nisn,
        s.name,
        SUM(CASE WHEN a.status = 'hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN a.status = 'sakit' THEN 1 ELSE 0 END) as sakit,
        SUM(CASE WHEN a.status = 'izin' THEN 1 ELSE 0 END) as izin,
        SUM(CASE WHEN a.status = 'alpha' THEN 1 ELSE 0 END) as alpha,
        ROUND((SUM(CASE WHEN a.status = 'hadir' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as percentage
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND DATE_FORMAT(a.date, '%Y-%m') = ?
      WHERE s.class_id = ?
      GROUP BY s.id
      ORDER BY s.name
    `, [month, classId]);

    // Build CSV content instead of xlsx (xlsx was not installed)
    let csv = '\uFEFF'; // BOM for Excel UTF-8
    csv += `Laporan Presensi Kelas ${className}\n`;
    csv += `Bulan: ${month}\n`;
    csv += '\n';
    csv += 'NIS,Nama Siswa,Hadir,Sakit,Izin,Alpha,Persentase (%)\n';

    if (Array.isArray(studentData)) {
      studentData.forEach((student: any) => {
        csv += `"${student.nisn || ''}","${student.name || ''}",${student.hadir || 0},${student.sakit || 0},${student.izin || 0},${student.alpha || 0},${student.percentage || 0}\n`;
      });
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="laporan-presensi-${className}-${month}.csv"`
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Error exporting report' }, { status: 500 });
  }
}
