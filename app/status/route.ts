import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  // TODO: 从 Vercel KV 读取状态
  // 暂时返回默认状态，实际部署时需要在 Vercel 项目设置中添加 KV 数据库
  const status = {
    state: 'idle',
    message: '等待命令...',
    updatedAt: new Date().toISOString()
  }

  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  })
}
