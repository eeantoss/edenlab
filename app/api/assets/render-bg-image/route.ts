import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    image: '',
    hash: 'abc123',
    revision: 1
  });
}
