import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const rows: any = await query(
      'SELECT id, name, email FROM teachers WHERE email = ? AND password = ?',
      [email, password]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const teacher = rows[0];
      const response = NextResponse.json({
        success: true,
        teacher: teacher
      });
      // Set both teacher_id and auth_token cookie so middleware recognizes login
      response.cookies.set('teacher_id', String(teacher.id), { maxAge: 86400, path: '/' });
      // auth_token used by middleware — for now store simple token (teacher id)
      response.cookies.set('auth_token', String(teacher.id), { httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/' });
      return response;
    }

    return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
