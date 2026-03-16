import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    msg: 'restored reference background',
    image_url: '/star-office/assets/reference/background.png',
    path: 'assets/reference/background.png',
  });
}
