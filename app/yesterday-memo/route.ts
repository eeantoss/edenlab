import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    content: '昨日小记：暂无数据显示。',
    date: new Date().toISOString()
  });
}
