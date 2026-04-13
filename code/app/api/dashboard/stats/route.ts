import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Use Jakarta timezone for today's date
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });

    // Step 1: Get total students
    let totalStudents = 0;
    try {
      const totalResult: any = await query('SELECT COUNT(*) as count FROM students');
      totalStudents = Array.isArray(totalResult) ? Number(totalResult[0]?.count || 0) : 0;
    } catch (e: any) {
      console.error('Stats step 1 (students count) failed:', e.message);
    }

    // Step 2: Get today's attendance stats
    let presentToday = 0;
    let sickToday = 0;
    let izinToday = 0;
    let alphaToday = 0;

    try {
      const attendanceResult: any = await query(
        'SELECT status, COUNT(*) as count FROM attendance WHERE date = ? GROUP BY status',
        [today]
      );

      if (Array.isArray(attendanceResult)) {
        attendanceResult.forEach((row: any) => {
          const count = Number(row.count || 0);
          if (row.status === 'hadir') presentToday = count;
          if (row.status === 'sakit') sickToday = count;
          if (row.status === 'izin') izinToday = count;
          if (row.status === 'alpha') alphaToday = count;
        });
      }
    } catch (e: any) {
      console.error('Stats step 2 (attendance today) failed:', e.message);
    }

    const attendancePercentage = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0;

    // Step 3: Get weekly data (last 7 days)
    let weeklyData: any[] = [];
    try {
      const weeklyResult: any = await query(
        `SELECT 
          DATE_FORMAT(date, '%Y-%m-%d') as day,
          SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
          SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
          SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
          SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) as alpha
        FROM attendance
        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY date
        ORDER BY date ASC
        LIMIT 7`
      );

      if (Array.isArray(weeklyResult)) {
        weeklyData = weeklyResult.map((row: any) => {
          const dateObj = new Date(row.day + 'T00:00:00');
          const formattedDay = !isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
            : String(row.day);

          return {
            day: formattedDay,
            hadir: Number(row.hadir || 0),
            sakit: Number(row.sakit || 0),
            izin: Number(row.izin || 0),
            alpha: Number(row.alpha || 0),
          };
        });
      }
    } catch (e: any) {
      console.error('Stats step 3 (weekly data) failed:', e.message);
    }

    return NextResponse.json({
      totalStudents,
      presentToday,
      sickToday,
      izinToday,
      alphaToday,
      attendancePercentage,
      weeklyData,
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ 
      error: 'Error fetching stats', 
      details: error?.message || String(error),
      code: error?.code,
    }, { status: 500 });
  }
}
