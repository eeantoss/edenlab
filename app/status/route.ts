import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// 状态文件路径（本地存储）
const STATUS_FILE = path.join(process.cwd(), 'dean-status.json')

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

export async function GET() {
  await ensureStatusFile()

  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(data), {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (e) {
    const response = {
      state: 'idle',
      message: '等待命令...',
      updatedAt: new Date().toISOString()
    }
    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'no-store' }
    })
  }
}

export async function POST(req: Request) {
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
