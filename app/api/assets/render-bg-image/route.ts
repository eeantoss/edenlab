import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    msg: 'rendered',
    image_url: data?.image_url || '/star-office/assets/generated/bg-latest.png',
    path: data?.path || 'assets/generated/bg-latest.png',
  });
}
