import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ queued: true, taskId: Date.now().toString() });
}
