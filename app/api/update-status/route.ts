import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Secret token for authentication
const STATUS_SECRET = process.env.STATUS_SECRET || 'default-secret-change-in-production'

interface StatusData {
  state: 'idle' | 'working' | 'delegating' | 'waiting'
  message: string
  updatedAt: string
  clientIP?: string
}

// 验证请求
function validateRequest(req: NextRequest): { valid: boolean; error?: string } {
  const authHeader = req.headers.get('authorization')
  const expectedAuth = `Bearer ${STATUS_SECRET}`

  if (!authHeader || authHeader !== expectedAuth) {
    return { valid: false, error: 'Unauthorized: Invalid or missing token' }
  }

  const contentType = req.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return { valid: false, error: 'Invalid Content-Type: Expected application/json' }
  }

  if (req.method !== 'POST') {
    return { valid: false, error: 'Method not allowed: Use POST' }
  }

  return { valid: true }
}

// 验证状态数据
function validateStatus(data: any): data is StatusData {
  const validStates = ['idle', 'working', 'delegating', 'waiting']

  if (!data || typeof data !== 'object') {
    return false
  }

  if (!data.state || typeof data.state !== 'string' || !validStates.includes(data.state)) {
    return false
  }

  if (data.message && typeof data.message !== 'string') {
    return false
  }

  return true
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  const validation = validateRequest(req)
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    if (!validateStatus(body)) {
      return NextResponse.json(
        { error: 'Invalid status data' },
        { status: 400 }
      )
    }

    const status: StatusData = {
      state: body.state || 'idle',
      message: body.message || '',
      updatedAt: new Date().toISOString(),
      clientIP: req.headers.get('x-forwarded-for') || 'unknown'
    }

    // TODO: 添加 Vercel KV 存储
    // 暂时只更新缓存，实际部署时需要在 Vercel 项目设置中添加 KV 数据库
    revalidateTag('edenlab-status')

    return NextResponse.json({
      success: true,
      status: status,
      message: 'Status updated successfully'
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
