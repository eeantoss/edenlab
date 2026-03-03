import { NextResponse } from 'next/server'

const GIST_ID = '8c51e64ac390c90f5bf4388c91c4d820'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

export async function GET() {
  try {
    const headers: Record<string, string> = { 'Cache-Control': 'no-cache' }
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, { headers, cache: 'no-store' })
    const gist = await res.json()
    const content = gist.files?.['meme-radar.json']?.content
    if (content) return NextResponse.json(JSON.parse(content))
    const raw = await fetch(`https://gist.githubusercontent.com/dongzhiyiden/${GIST_ID}/raw/meme-radar.json?t=${Date.now()}`, { cache: 'no-store' })
    return NextResponse.json(await raw.json())
  } catch {
    return NextResponse.json({ news: [] })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'meme-radar.json': { content: JSON.stringify(body, null, 2) } } }),
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
