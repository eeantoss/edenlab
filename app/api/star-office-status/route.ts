import { NextResponse } from 'next/server'

export async function GET() {
  // Vercel 环境下无法访问本地 Flask，返回默认状态
  try {
    // 尝试连接 Flask backend（仅在本地开发）
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      const res = await fetch('http://127.0.0.1:19000/status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    // 忽略错误，返回默认状态
  }

  // Vercel 环境下的默认返回
  return NextResponse.json({
    state: 'idle',
    detail: '待命中（Vercel展示模式）',
    officeName: '百万的办公室',
    progress: 0,
    updated_at: new Date().toISOString()
  })
}