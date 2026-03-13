import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params;
    const today = new Date().toISOString().split('T')[0];
    
    const students = await db.getStudentsByClass(classId);
    const attendance = await db.getAttendanceByDate(today, classId);

    // Merge student data with attendance data
    const result = Array.isArray(students) ? students.map((student: any) => {
      const attendanceRecord: any = Array.isArray(attendance) 
        ? attendance.find((a: any) => a.student_id === student.id)
        : null;
      
      return {
        ...student,
        status: attendanceRecord?.status || 'hadir',
      };
    }) : [];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json({ error: 'Error fetching attendance' }, { status: 500 });
  }
}
