import { NextResponse } from 'next/server'

const SKILLS_GIST_ID = '58580062545b9b5e704e178273d0659f'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const RAW_BASE = `https://gist.githubusercontent.com/dongzhiyiden/${SKILLS_GIST_ID}/raw`

export const revalidate = 0

export async function GET() {
  try {
    const res = await fetch(`${RAW_BASE}/skill-data.json?t=${Date.now()}`, {
      next: { revalidate: 0 }, headers: { 'Cache-Control': 'no-cache' }
    })
    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
    }
  } catch {}
  return NextResponse.json([])
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.secret !== process.env.STATUS_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    await fetch(`https://api.github.com/gists/${SKILLS_GIST_ID}`, {
      method: 'PATCH',
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'skill-data.json': { content: JSON.stringify(body.skills, null, 2) } } })
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
