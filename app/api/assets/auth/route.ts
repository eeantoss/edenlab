import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ authenticated: false });
}

export async function POST(request: NextRequest) {
  // Let's parse request JSON
  const body = await request.json();
  console.log('POST body:', body);
  return NextResponse.json({ success: true, message: 'OK' });
}
