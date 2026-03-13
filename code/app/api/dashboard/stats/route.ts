import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get total students
    const totalResult: any = await query('SELECT COUNT(*) as count FROM students');
    const totalStudents = Array.isArray(totalResult) ? totalResult[0].count : 0;

    // Get today's attendance stats
    const attendanceResult: any = await query(
      'SELECT status, COUNT(*) as count FROM attendance WHERE date = ? GROUP BY status',
      [today]
    );

    let presentToday = 0;
    let sickToday = 0;
    let izinToday = 0;
    let alphaToday = 0;

    if (Array.isArray(attendanceResult)) {
      attendanceResult.forEach((row: any) => {
        if (row.status === 'hadir') presentToday = row.count;
        if (row.status === 'sakit') sickToday = row.count;
        if (row.status === 'izin') izinToday = row.count;
        if (row.status === 'alpha') alphaToday = row.count;
      });
    }

    const attendancePercentage = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0;

    // Get weekly data (last 7 days)
    const weeklyResult: any = await query(`
      SELECT 
        DATE(date) as day,
        SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
        SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
        SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) as alpha
      FROM attendance
      WHERE date >= DATE_SUB(?, INTERVAL 7 DAY)
      GROUP BY DATE(date)
      ORDER BY date DESC
      LIMIT 5
    `, [today]);

    const weeklyData = Array.isArray(weeklyResult) ? weeklyResult.map((row: any) => ({
      day: row.day,
      hadir: row.hadir,
      sakit: row.sakit,
      izin: row.izin,
      alpha: row.alpha,
    })) : [];

    return NextResponse.json({
      totalStudents,
      presentToday,
      sickToday,
      izinToday,
      alphaToday,
      attendancePercentage,
      weeklyData,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}
