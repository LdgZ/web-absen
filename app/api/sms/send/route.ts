import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, message, type } = body;

    if (!phone || !message) {
      return NextResponse.json({ success: false, error: 'phone and message required' }, { status: 400 });
    }

    const result = await sendSMS(phone, message);

    return NextResponse.json({ success: result.success, result }, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
