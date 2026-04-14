import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const tableInfo: any = await query('SHOW INDEX FROM attendance');
    const hasUnique = Array.isArray(tableInfo) && tableInfo.some((idx: any) => 
      idx.Key_name !== 'PRIMARY' && 
      idx.Non_unique === 0 && 
      (idx.Column_name === 'student_id' || idx.Column_name === 'date')
    );

    if (!hasUnique) {
      await query('ALTER TABLE attendance ADD UNIQUE INDEX idx_student_date (student_id, date)');
      return NextResponse.json({ success: true, message: 'Unique index created' });
    }

    return NextResponse.json({ success: true, message: 'Unique index already exists', data: tableInfo });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
