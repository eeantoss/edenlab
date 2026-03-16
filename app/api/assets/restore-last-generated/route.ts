import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    msg: 'restored last generated background',
    image_url: '/star-office/assets/generated/bg-latest.png',
    path: 'assets/generated/bg-latest.png',
  });
}
