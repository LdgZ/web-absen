import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    // Get attendance data for the month
    const dailyData = await query(`
      SELECT
        DATE(date) as date,
        SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
        SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) as alpha,
        SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin
      FROM attendance
      WHERE class_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?
      GROUP BY DATE(date)
      ORDER BY date ASC
    `, [classId, month]);

    // Get status composition
    const statusComposition = await query(`
      SELECT
        status as name,
        COUNT(*) as value
      FROM attendance
      WHERE class_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?
      GROUP BY status
    `, [classId, month]);

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
    `, [month, classId]);

    const totalDays = Array.isArray(dailyData) ? dailyData.length : 0;
    const averagePresent = Array.isArray(studentData) && studentData.length > 0
      ? (studentData.reduce((sum: number, s: any) => sum + (s.percentage || 0), 0) / studentData.length).toFixed(1)
      : 0;

    return NextResponse.json({
      totalDays,
      averagePresent,
      dailyData: dailyData || [],
      statusComposition: (Array.isArray(statusComposition) ? statusComposition : []).map((s: any) => ({
        name: s.name === 'hadir' ? 'Hadir' : s.name === 'sakit' ? 'Sakit' : s.name === 'izin' ? 'Izin' : s.name === 'alpha' ? 'Alpha' : s.name,
        value: s.value,
      })),
      studentData: studentData || [],
    });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Error fetching report' }, { status: 500 });
  }
}
