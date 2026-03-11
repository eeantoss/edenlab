import { NextRequest, NextResponse } from 'next/server';

const VALID_CODE = '2681196279';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, code } = body;

    const submitted = password || code;
    const authenticated = submitted === VALID_CODE;
    return NextResponse.json({ 
      success: authenticated,
      authenticated: authenticated 
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: false });
}
