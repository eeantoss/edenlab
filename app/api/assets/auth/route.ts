import { NextRequest, NextResponse } from 'next/server';

const PASSCODE = '2681196279';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, code } = body;
    const submitted = password || code || '';
    
    const authenticated = submitted === PASSCODE;
    return NextResponse.json({
      success: authenticated,
      authenticated: authenticated
    });
  } catch(e) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: false });
}
