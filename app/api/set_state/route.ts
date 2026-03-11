import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { state, message } = data;
  // Store the status in memory (in a production app, use a database)
  globalThis.lastState = { state, message, updatedAt: Date.now() };
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const data = globalThis.lastState || { state: 'idle', message: '' };
  return NextResponse.json(data);
}
