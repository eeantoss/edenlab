import { NextResponse } from 'next/server'

const GIST_ID = 'b16a8d2531f60463227de8a168feb6c1'
const GIST_TOKEN = process.env.GITHUB_TOKEN || ''
const RAW_BASE = `https://gist.githubusercontent.com/dongzhiyiden/${GIST_ID}/raw`

export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch(`${RAW_BASE}/web3-news.json?t=${Date.now()}`, {
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
  return NextResponse.json({ date: '', updatedAt: '', news: [] })
}

// cron 写入新闻（需要 secret）
export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.secret !== process.env.STATUS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const content = JSON.stringify({
      date: body.date || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      news: body.news || []
    }, null, 2)
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files: { 'web3-news.json': { content } } })
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
