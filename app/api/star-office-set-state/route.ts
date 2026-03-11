import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Vercel 环境下无法访问本地 Flask，返回成功状态
  try {
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      const res = await fetch('http://127.0.0.1:19000/set_state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    // 忽略错误
  }

  // Vercel 环境下返回成功（展示模式）
  return NextResponse.json({ ok: true })
}