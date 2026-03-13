import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
  try {
    const { classId, date, records } = await request.json();

    let smsSent = 0;
    const alphaStudentIds: string[] = [];

    // Save attendance records
    for (const record of records) {
      // Normalize status to lowercase for DB enum
      const dbStatus = (record.status || 'hadir').toLowerCase();
      await query(
        'INSERT INTO attendance (student_id, class_id, date, status) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)',
        [record.studentId, classId, date, dbStatus]
      );

      // Track students with ALPHA status for SMS
      if (dbStatus === 'alpha') {
        alphaStudentIds.push(record.studentId);
      }
    }

    // Send SMS for ALPHA students
    if (alphaStudentIds.length > 0) {
      try {
        const placeholders = alphaStudentIds.map(() => '?').join(',');
        const students: any = await query(
          `SELECT id, phone_parent, name FROM students WHERE id IN (${placeholders})`,
          alphaStudentIds
        );

        const today = new Date().toLocaleDateString('id-ID');

        for (const student of (Array.isArray(students) ? students : [])) {
          const phone = student.phone_parent;
          if (phone) {
            const uppercaseName = (student.name || '').toUpperCase();
            const message = `Pemberitahuan: ${uppercaseName} tidak masuk (ALPHA) pada ${today}. Hubungi sekolah untuk informasi lebih lanjut.`;
            try {
              const result = await sendSMS(phone, message);
              if (result.success) smsSent++;
              console.log(`SMS sent to ${phone}:`, result);
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
      message: 'Presensi tersimpan',
      smsSent
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Error saving attendance' }, { status: 500 });
  }
}
