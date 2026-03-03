import { NextResponse } from 'next/server'

const GIST_ID = 'c9bbb669c42418db1120a51eb49b456d'
const GIST_TOKEN = process.env.GITHUB_TOKEN || ''

export const revalidate = 0

async function readGist(): Promise<any[]> {
  try {
    // 用 GitHub API 读，绕过 raw CDN 缓存
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${GIST_TOKEN}`, 'Cache-Control': 'no-cache' },
      cache: 'no-store',
    })
    const gist = await res.json()
    const content = gist.files?.['guestbook.json']?.content
    if (!content) return []
    const data = JSON.parse(content)
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export async function GET() {
  const data = await readGist()
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = (body.name || '匿名访客').slice(0, 20)
    const text = (body.text || '').trim().slice(0, 200)
    if (!text) return NextResponse.json({ error: '留言不能为空' }, { status: 400 })

    let messages = await readGist()

    const newMsg = {
      id: Date.now(), name, text,
      time: new Date().toISOString(),
      reply: null
    }
    messages = [newMsg, ...messages].slice(0, 50)

    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: { Authorization: `token ${GIST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'guestbook.json': { content: JSON.stringify(messages, null, 2) } } }),
      cache: 'no-store',
    })
    return NextResponse.json({ ok: true, msg: newMsg })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
