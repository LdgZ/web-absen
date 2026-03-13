import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows: any = await db.getStudentsByClass(id);

    const mapped = (rows || []).map((r: any) => ({
      id: r.id?.toString(),
      nis: r.nisn || '',
      name: r.name || '',
      parentPhone: r.phone_parent || '',
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching students by class:', error);
    return NextResponse.json([], { status: 200 });
  }
}
