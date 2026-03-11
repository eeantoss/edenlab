import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    items: []
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  // This would normally process some data
  return NextResponse.json({ ok: true, message: 'Success' });
}
