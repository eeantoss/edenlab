import { NextRequest, NextResponse } from 'next/server';
import { getOfficeState, setOfficeState } from '@/app/lib/office-state';

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  const { state, message, detail, progress, officeName } = data || {};
  const next = setOfficeState({
    state: state || 'idle',
    message: message || detail || '',
    detail: detail || message || '',
    progress: typeof progress === 'number' ? progress : undefined,
    officeName,
  });
  return NextResponse.json({ ok: true, ...next });
}

export async function GET() {
  return NextResponse.json(getOfficeState());
}
