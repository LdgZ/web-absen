import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', '', { maxAge: 0 });
  response.cookies.set('teacher_id', '', { maxAge: 0 });
  return response;
}
