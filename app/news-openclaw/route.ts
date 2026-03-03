import { NextResponse } from 'next/server'

const GIST_ID = 'dee062814134ebcc35cec0d4a6653e7f'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

export async function GET() {
  try {
    // 先试 API（有 token 时用），否则用 raw URL
    const headers: Record<string, string> = { 'Cache-Control': 'no-cache' }
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`
    
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers,
      cache: 'no-store',
    })
    const gist = await res.json()
    const content = gist.files?.['openclaw-news.json']?.content
    if (content) return NextResponse.json(JSON.parse(content))

    // fallback: raw URL（public gist 不需要 token）
    const raw = await fetch(
      `https://gist.githubusercontent.com/dongzhiyiden/${GIST_ID}/raw/openclaw-news.json?t=${Date.now()}`,
      { cache: 'no-store' }
    )
    const data = await raw.json()
    return NextResponse.json(data)
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
      body: JSON.stringify({ files: { 'openclaw-news.json': { content: JSON.stringify(body, null, 2) } } }),
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
