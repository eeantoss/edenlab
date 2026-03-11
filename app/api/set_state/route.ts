import { NextRequest, NextResponse } from 'next/server';

declare global {
  var edenLabState: { state: string; message: string } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, message } = body;
    globalThis.edenLabState = { state: state || 'unknown', message: message || '' };
    return NextResponse.json({ ok: true, state, message });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function GET() {
  const state = globalThis.edenLabState || { state: 'unknown', message: 'N/A' };
  return NextResponse.json(state);
}
