import { NextRequest, NextResponse } from 'next/server'

// GitHub Gist 配置
const GIST_ID = process.env.GIST_ID || ''
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

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

    // 存储到 GitHub Gist
    if (!GIST_ID || !GITHUB_TOKEN) {
      console.warn('Gist not configured, using fallback (status not persisted)')
      return NextResponse.json({
        success: true,
        status: status,
        message: 'Status updated (not persisted - configure GIST_ID and GITHUB_TOKEN)',
        warning: 'Gist not configured'
      })
    }

    try {
      const content = JSON.stringify(status, null, 2)

      const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          files: {
            'edenlab-status.json': {
              content: content
            }
          }
        })
      })

      if (!gistRes.ok) {
        const errorText = await gistRes.text()
        console.error('Gist update failed:', errorText)
        return NextResponse.json(
          { error: 'Failed to update Gist', details: errorText },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        status: status,
        message: 'Status updated successfully',
        storedIn: 'GitHub Gist'
      })

    } catch (error) {
      console.error('Error updating Gist:', error)
      return NextResponse.json(
        { error: 'Gist update failed', details: String(error) },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
