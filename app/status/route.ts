import { NextResponse } from 'next/server'

// 状态存在内存里（Vercel serverless 每次可能重置，但够用）
// 生产环境可换成 Vercel KV 或 Supabase
let currentState = {
  state: 'idle',
  message: '在休息室抽烟，等待命令...',
  updatedAt: new Date().toISOString()
}

export async function GET() {
  return NextResponse.json(currentState, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.secret !== process.env.STATUS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    currentState = {
      state: body.state || 'idle',
      message: body.message || '',
      updatedAt: new Date().toISOString()
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
}
