import { NextResponse } from 'next/server'

const GIST_ID = '6cdba19a9b1a3ac05f1213a0d8b0f0f8'
const GIST_TOKEN = process.env.GITHUB_TOKEN || ''
const STATUS_SECRET = process.env.STATUS_SECRET || ''

export const revalidate = 0

async function readGist() {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${GIST_TOKEN}` }, cache: 'no-store',
    })
    const gist = await res.json()
    const content = gist.files?.['dean-diary.json']?.content
    return content ? JSON.parse(content) : []
  } catch { return [] }
}

export async function GET() {
  const data = await readGist()
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // 鉴权：需要 secret
    if (!STATUS_SECRET || body.secret !== STATUS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    let entries = await readGist()
    if (!Array.isArray(entries)) entries = []
    // 移除 secret 字段再存储
    const { secret: _, ...entry } = body
    entries = [entry, ...entries].slice(0, 100)
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: { Authorization: `token ${GIST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'dean-diary.json': { content: JSON.stringify(entries, null, 2) } } }),
      cache: 'no-store',
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
