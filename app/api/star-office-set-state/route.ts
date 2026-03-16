import { NextRequest, NextResponse } from 'next/server';
import { setOfficeState } from '@/app/lib/office-state';

export async function POST(req: NextRequest) {
  const data = await req.json().catch(() => ({}));
  const { state, detail, message, progress, officeName } = data || {};
  const next = setOfficeState({
    state: state || 'idle',
    detail: detail || message || '',
    message: message || detail || '',
    progress: typeof progress === 'number' ? progress : undefined,
    officeName,
  });
  return NextResponse.json({ ok: true, ...next });
}
