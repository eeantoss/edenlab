import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    msg: 'restored previous version',
    path: data?.path || '',
  });
}
