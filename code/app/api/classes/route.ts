import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const classes = await db.getAllClasses();
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || '';
    
    if (!name) {
      return NextResponse.json({ error: 'Class name is required' }, { status: 400 });
    }

    const newClass = await db.createClass(name, 1);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Error creating class' }, { status: 500 });
  }
}
