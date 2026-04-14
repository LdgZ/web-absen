import { NextRequest, NextResponse } from 'next/server';

// In serverless environments (Vercel), filesystem writes are ephemeral.
// Use in-memory defaults. For persistence, these should be stored in the database.
const DEFAULT_SETTINGS = {
  enabled: true,
  sendOnAlpha: true,
  sendOnSakit: true,
  sendOnIzin: true,
  sendOnWarning: true,
};

// In-memory settings (resets on cold start, but that's acceptable for now)
let currentSettings = { ...DEFAULT_SETTINGS };

export async function GET() {
  return NextResponse.json(currentSettings);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    currentSettings = { ...DEFAULT_SETTINGS, ...body };
    return NextResponse.json({ settings: currentSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
