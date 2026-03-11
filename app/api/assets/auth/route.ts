import { NextRequest, NextResponse } from 'next/server';

const PASSCODE = '2681196279';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = body.password || body.code || '';
  const ok = password === PASSCODE;
  return NextResponse.json({
    ok: ok,  // Added
    success: ok, 
    authenticated: ok 
  });
}
