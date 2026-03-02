import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

// Secret token for authentication
// 在 Vercel 环境变量中设置: STATUS_SECRET
const STATUS_SECRET = process.env.STATUS_SECRET || 'default-secret-change-in-production'

// Vercel KV binding
// 需要在 vercel.json 中配置
type KVNamespace = {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>
}

declare global {
  var edenlabStatusKV: KVNamespace
}

const kv = (globalThis as any).edenlabStatusKV

interface StatusData {
  state: 'idle' | 'working' | 'delegating' | 'waiting'
  message: string
  updatedAt: string
  clientIP?: string
}

// 验证请求
function validateRequest(req: NextRequest): { valid: boolean; error?: string } {
  // 1. 检查 Authorization header
  const authHeader = req.headers.get('authorization')
  const expectedAuth = `Bearer ${STATUS_SECRET}`

  if (!authHeader || authHeader !== expectedAuth) {
    return { valid: false, error: 'Unauthorized: Invalid or missing token' }
  }

  // 2. 检查 Content-Type
  const contentType = req.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return { valid: false, error: 'Invalid Content-Type: Expected application/json' }
  }

  // 3. 检查请求方法
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
  // 1. 验证请求
  const validation = validateRequest(req)
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 401 }
    )
  }

  // 2. 解析请求体
  try {
    const body = await req.json()

    // 3. 验证状态数据
    if (!validateStatus(body)) {
      return NextResponse.json(
        { error: 'Invalid status data' },
        { status: 400 }
      )
    }

    // 4. 准备状态数据
    const status: StatusData = {
      state: body.state || 'idle',
      message: body.message || '',
      updatedAt: new Date().toISOString(),
      clientIP: req.headers.get('x-forwarded-for') || 'unknown'
    }

    // 5. 存储到 Vercel KV
    try {
      if (kv) {
        await kv.set('edenlab_status', JSON.stringify(status), {
          expirationTtl: 24 * 60 * 60 // 24小时过期
        })
      } else {
        console.warn('KV not available, using fallback storage')
      }
    } catch (error) {
      console.error('Error storing to KV:', error)
      // KV 不可用时，降级处理
      return NextResponse.json(
        { error: 'Storage unavailable' },
        { status: 503 }
      )
    }

    // 6. 清除缓存
    revalidateTag('edenlab-status')

    // 7. 返回成功
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
