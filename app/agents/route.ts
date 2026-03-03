import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  // 暂无多 Agent，返回空列表
  return NextResponse.json([], {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  })
}
