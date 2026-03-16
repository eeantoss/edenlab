import { NextRequest, NextResponse } from 'next/server';

const MODEL = 'nanobanana-pro';

export async function GET() {
  const key = process.env.GEMINI_API_KEY || '';
  const masked = key ? `${key.slice(0, 3)}***${key.slice(-4)}` : '';
  return NextResponse.json({
    success: true,
    has_api_key: !!key,
    api_key_masked: masked,
    gemini_model: MODEL,
  });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({
    ok: false,
    msg: 'Vercel 线上环境暂不支持通过前端写入 API Key，请在部署环境变量中设置 GEMINI_API_KEY',
  });
}
