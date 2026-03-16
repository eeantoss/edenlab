import { NextResponse } from 'next/server';

function buildMemoFromPoints(points: string[] = [], poem?: string) {
  const lines: string[] = [];

  for (const point of points) {
    const clean = String(point || '').trim();
    if (clean) lines.push(`· ${clean}`);
  }

  if (poem && poem.trim()) {
    if (lines.length) lines.push('');
    lines.push(`「${poem.trim().replace(/^「|」$/g, '')}」`);
  }

  return lines.join('\n').trim();
}

export async function GET() {
  const date = '2026-03-15';
  const points = [
    '跟单 bot 运行中，追踪 11 个聪明钱钱包',
    '止盈+30%卖半仓，止损-20%全出',
    '每日目标 +20U，稳步推进',
  ];
  const poem = '长风破浪会有时，直挂云帆济沧海。';
  const memo = buildMemoFromPoints(points, poem);

  return NextResponse.json({
    success: true,
    date,
    memo,
    content: memo,
    points,
    poem,
  });
}
