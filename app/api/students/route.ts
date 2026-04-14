import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const rows: any = await query(
      'SELECT s.id, s.nisn, s.name, s.class_id, s.phone_parent, c.name as className FROM students s LEFT JOIN classes c ON s.class_id = c.id'
    );

    const mapped = (rows || []).map((r: any) => ({
      id: r.id?.toString(),
      nis: r.nisn || '',
      name: r.name || '',
      classId: r.class_id?.toString() || '',
      className: r.className || '',
      parentPhone: r.phone_parent || '',
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name || '';
    const nis = body.nis || '';
    const classId = body.classId || null;
    const parentPhone = body.parentPhone || '';

    const result: any = await query(
      'INSERT INTO students (name, nisn, class_id, phone_parent) VALUES (?, ?, ?, ?)',
      [name, nis, classId, parentPhone]
    );

    return NextResponse.json({
      id: result.insertId?.toString(),
      nis,
      name,
      classId,
      parentPhone,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Error creating student' }, { status: 500 });
  }
}
