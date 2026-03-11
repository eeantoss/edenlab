import { NextRequest, NextResponse, NextRequest } from 'next/server';

declare global {
  var edenLabState: { state: string; message: string } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, message, code } = body;
    
    globalThis.edenLabState = { state, message };
    return NextResponse.json({ ok: true, state, message });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  const current = globalThis.edenLabState || { state: 'unknown', message: 'N/A' };
  return NextResponse.json(current);
}
