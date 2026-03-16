import { NextResponse, NextRequest } from 'next/server';

type RuntimeState = {
  state: string;
  message: string;
  updatedAt?: number;
};

const runtimeState = globalThis as typeof globalThis & {
  lastState?: RuntimeState;
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { state, message } = data;
  // Store the status in memory (in a production app, use a database)
  runtimeState.lastState = { state, message, updatedAt: Date.now() };
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const data = runtimeState.lastState || { state: 'idle', message: '' };
  return NextResponse.json(data);
}
