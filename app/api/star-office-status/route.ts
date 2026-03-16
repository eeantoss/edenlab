import { NextResponse } from 'next/server';
import { getOfficeState } from '@/app/lib/office-state';

export async function GET() {
  const state = getOfficeState();
  return NextResponse.json({
    state: state.state,
    detail: state.detail || state.message || '',
    officeName: state.officeName || '百万的办公室',
    progress: typeof state.progress === 'number' ? state.progress : 0,
    updated_at: state.updated_at || new Date().toISOString(),
  });
}
