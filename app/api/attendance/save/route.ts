import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { classId, date, records } = await request.json();

    let smsSent = 0;
    const notifyStudentIds: { id: string; status: string }[] = [];

    // Save attendance records
    for (const record of records) {
      // Normalize status to lowercase for DB enum
      const dbStatus = (record.status || 'hadir').toLowerCase();
      await query(
        'INSERT INTO attendance (student_id, class_id, date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)',
        [record.studentId, classId, date, dbStatus]
      );

      // Track students with non-hadir status for SMS notification
      if (dbStatus === 'alpha' || dbStatus === 'sakit' || dbStatus === 'izin') {
        notifyStudentIds.push({ id: record.studentId, status: dbStatus });
      }
    }

    // Send SMS for non-hadir students
    if (notifyStudentIds.length > 0) {
      try {
        const ids = notifyStudentIds.map(s => s.id);
        const placeholders = ids.map(() => '?').join(',');
        const students: any = await query(
          `SELECT id, phone_parent, name FROM students WHERE id IN (${placeholders})`,
          ids
        );

        const today = new Date().toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' });

        for (const student of (Array.isArray(students) ? students : [])) {
          const phone = student.phone_parent;
          if (!phone) continue;

          const name = student.name || '';
          const titleCaseName = name
            .toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

          // Find the status for this student
          const entry = notifyStudentIds.find(n => String(n.id) === String(student.id));
          const status = entry?.status || 'alpha';

          // Generate appropriate message based on status
          let message = '';
          if (status === 'alpha') {
            message = `Bapak/Ibu, menginformasikan bahwa ananda ${titleCaseName} hari ini (${today}) tidak masuk sekolah tanpa keterangan (Alpha). Mohon informasinya bila ada kendala, terima kasih. - SDN Wringinagung 3`;
          } else if (status === 'sakit') {
            message = `Bapak/Ibu, menginformasikan bahwa ananda ${titleCaseName} hari ini (${today}) tercatat tidak masuk sekolah karena Sakit. Semoga lekas sembuh untuk ananda. Terima kasih. - SDN Wringinagung 3`;
          } else if (status === 'izin') {
            message = `Bapak/Ibu, menginformasikan bahwa ananda ${titleCaseName} hari ini (${today}) tercatat tidak masuk sekolah karena Izin. Terima kasih atas konfirmasinya. - SDN Wringinagung 3`;
          }

          if (message) {
            try {
              const result = await sendSMS(phone, message);
              if (result.success) smsSent++;
              console.log(`SMS (${status}) sent to ${phone}:`, result);
            } catch (smsErr) {
              console.error(`Failed to send SMS to ${phone}:`, smsErr);
            }
          }
        }
      } catch (smsError) {
        console.error('Error processing SMS sending:', smsError);
        // Don't fail the whole request if SMS fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Presensi berhasil disimpan',
      smsSent
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Error saving attendance' }, { status: 500 });
  }
}
