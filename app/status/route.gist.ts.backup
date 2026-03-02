import { NextResponse } from 'next/server'

const GIST_ID = '914071deaedb60bf6c646ab5e21653a2'
const GIST_TOKEN = process.env.GITHUB_TOKEN || ''
const RAW_BASE = `https://gist.githubusercontent.com/dongzhiyiden/${GIST_ID}/raw`

export const revalidate = 0

export async function GET() {
  try {
    // 加时间戳防缓存
    const res = await fetch(`${RAW_BASE}/dean-status.json?t=${Date.now()}`, {
      next: { revalidate: 0 },
      headers: { 'Cache-Control': 'no-cache' }
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
      })
    }
  } catch {}
  return NextResponse.json(
    { state: 'idle', message: '等待命令...', updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.secret !== process.env.STATUS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const content = JSON.stringify({
      state: body.state || 'idle',
      message: body.message || '',
      updatedAt: new Date().toISOString()
    })
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files: { 'dean-status.json': { content } } })
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
