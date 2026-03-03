import { NextResponse } from 'next/server'

const GIST_ID = 'ef2c8f59c91702da020dc5387502951f'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const ONLINE_WINDOW_MS = 5 * 60 * 1000 // 5分钟内算在线

async function readStats() {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }, cache: 'no-store',
    })
    const gist = await res.json()
    const content = gist.files?.['online-stats.json']?.content
    return content ? JSON.parse(content) : null
  } catch { return null }
}

async function writeStats(stats: any) {
  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { 'online-stats.json': { content: JSON.stringify(stats, null, 2) } } }),
    cache: 'no-store',
  })
}

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'no sessionId' }, { status: 400 })

    const stats = await readStats()
    if (!stats) return NextResponse.json({ online: 1, peak: 1 })

    const now = Date.now()

    // 更新当前访客心跳
    stats.visitors[sessionId] = now
    stats.totalVisits = (stats.totalVisits || 0) + 1

    // 清除超时访客（5分钟无心跳）
    for (const [id, ts] of Object.entries(stats.visitors as Record<string, number>)) {
      if (now - ts > ONLINE_WINDOW_MS) delete stats.visitors[id]
    }

    const currentOnline = Object.keys(stats.visitors).length

    // 更新历史峰值
    if (currentOnline > (stats.peakOnline || 0)) {
      stats.peakOnline = currentOnline
      stats.peakTime = new Date().toISOString()
    }

    // 异步写入，不阻塞响应
    writeStats(stats).catch(() => {})

    return NextResponse.json({
      online: currentOnline,
      peak: stats.peakOnline,
      peakTime: stats.peakTime,
      total: stats.totalVisits,
    })
  } catch (e) {
    return NextResponse.json({ online: 1, peak: 1 }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await readStats()
    if (!stats) return NextResponse.json({ online: 1, peak: 1 })
    const now = Date.now()
    const online = Object.values(stats.visitors as Record<string, number>)
      .filter(ts => now - ts < ONLINE_WINDOW_MS).length
    return NextResponse.json({
      online: Math.max(1, online),
      peak: stats.peakOnline || 1,
      peakTime: stats.peakTime,
      total: stats.totalVisits || 0,
    })
  } catch {
    return NextResponse.json({ online: 1, peak: 1 })
  }
}
