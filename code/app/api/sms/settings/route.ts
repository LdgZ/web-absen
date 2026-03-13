import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'sms-settings.json');

const DEFAULT_SETTINGS = {
  enabled: true,
  sendOnAlpha: true,
  sendOnWarning: true,
};

async function readSettings() {
  try {
    const txt = await fs.readFile(SETTINGS_PATH, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

async function writeSettings(obj: any) {
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(obj, null, 2), 'utf8');
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const s = { ...DEFAULT_SETTINGS, ...body };
    await writeSettings(s);
    return NextResponse.json({ settings: s });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
