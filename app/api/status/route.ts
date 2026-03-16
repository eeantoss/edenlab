import { NextResponse } from 'next/server';
import { getOfficeState } from '@/app/lib/office-state';

export async function GET() {
  return NextResponse.json(getOfficeState());
}
