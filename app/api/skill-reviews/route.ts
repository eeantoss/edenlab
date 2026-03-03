import { NextResponse } from 'next/server'

const REVIEWS_GIST_ID = 'd9a2b12345cbfc3e3b658b6dde79adde'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const RAW_BASE = `https://gist.githubusercontent.com/dongzhiyiden/${REVIEWS_GIST_ID}/raw`

export const revalidate = 0

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const skillId = searchParams.get('id')
  try {
    const res = await fetch(`${RAW_BASE}/skill-reviews.json?t=${Date.now()}`, {
      next: { revalidate: 0 }, headers: { 'Cache-Control': 'no-cache' }
    })
    if (res.ok) {
      const all = await res.json()
      const data = skillId ? (all[skillId] || []) : all
      return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
    }
  } catch {}
  return NextResponse.json(skillId ? [] : {})
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { skillId, name, text, rating } = body
    if (!skillId || !text?.trim()) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }
    const res = await fetch(`${RAW_BASE}/skill-reviews.json?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' }
    })
    const all = res.ok ? await res.json() : {}
    const reviews = Array.isArray(all[skillId]) ? all[skillId] : []
    const newReview = {
      id: Date.now(),
      name: (name || '匿名').slice(0, 20),
      text: text.trim().slice(0, 300),
      rating: Math.max(1, Math.min(5, Number(rating) || 3)),
      time: new Date().toISOString()
    }
    all[skillId] = [newReview, ...reviews].slice(0, 30)
    await fetch(`https://api.github.com/gists/${REVIEWS_GIST_ID}`, {
      method: 'PATCH',
      headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { 'skill-reviews.json': { content: JSON.stringify(all, null, 2) } } })
    })
    return NextResponse.json({ ok: true, review: newReview })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
