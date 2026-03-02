import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// 状态文件路径（本地存储）
const STATUS_FILE = path.join(process.cwd(), 'dean-status.json')

// Vercel KV binding
type KVNamespace = {
  get: (key: string) => Promise<string | null>
}

declare global {
  var edenlabStatusKV: KVNamespace
}

const kv = (globalThis as any).edenlabStatusKV

export const revalidate = 0

// 初始化状态文件
async function ensureStatusFile() {
  try {
    await fs.access(STATUS_FILE)
  } catch {
    // 文件不存在，创建初始状态
    const initialStatus = {
      state: 'idle',
      message: '等待命令...',
      updatedAt: new Date().toISOString()
    }
    await fs.writeFile(STATUS_FILE, JSON.stringify(initialStatus, null, 2))
  }
}

// 从本地文件读取
async function getStatusFromFile() {
  await ensureStatusFile()

  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    const response = {
      state: 'idle',
      message: '等待命令...',
      updatedAt: new Date().toISOString()
    }
    return response
  }
}

// 从 Vercel KV 读取
async function getStatusFromKV() {
  try {
    if (!kv) {
      // KV 不可用，降级到本地文件
      console.warn('KV not available, falling back to local file')
      return await getStatusFromFile()
    }

    const data = await kv.get('edenlab_status')
    if (!data) {
      // KV 中没有数据，返回默认状态
      return {
        state: 'idle',
        message: '等待命令...',
        updatedAt: new Date().toISOString()
      }
    }

    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from KV:', error)
    // 出错时降级到本地文件
    return await getStatusFromFile()
  }
}

export async function GET() {
  // 优先从 KV 读取（云端），降级到本地文件（开发环境）
  const status = await getStatusFromKV()

  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  })
}

export async function POST(req: Request) {
  // POST 请求已经迁移到 /api/update-status
  // 为了向后兼容，这里继续支持本地文件更新
  await ensureStatusFile()

  try {
    const body = await req.json()

    const content = JSON.stringify({
      state: body.state || 'idle',
      message: body.message || '',
      updatedAt: new Date().toISOString()
    })

    // 写入本地文件
    await fs.writeFile(STATUS_FILE, content, 'utf-8')

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
