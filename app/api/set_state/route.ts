import { NextRequest, NextResponse } from 'next/server';

declare global {
  var edenLabState: { state: string; message: string } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    globalThis.edenLabState = { 
      state: body.state || 'unknown', 
      message: body.message || '' 
    };
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  const state = globalThis.edenLabState || { state: 'unknown', message: 'N/A' };
  return NextResponse.json(state);
}
