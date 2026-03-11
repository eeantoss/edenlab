"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── 龙虾基地组件 ──────────────────────────────────────
function SewerBase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<{ state: string; detail: string } | null>(null)

  // 读取迪恩工作状态
  useEffect(() => {
    const fetchStatus = () =>
      fetch('/status?t=' + Date.now()).then(r => r.json()).then(setStatus).catch(() => {})
    fetchStatus()
    const t = setInterval(fetchStatus, 30000)
    return () => clearInterval(t)
  }, [])

  // Canvas 绘制下水道场景
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let tick = 0

    // NPC 位置状态
    const npcs = [
      { x: 80, y: 120, dir: 1, task: 'mine' },
      { x: 200, y: 140, dir: -1, task: 'carry' },
      { x: 320, y: 110, dir: 1, task: 'carry' },
    ]

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // 背景 - 下水道石墙
      ctx.fillStyle = '#0a0f0a'
      ctx.fillRect(0, 0, W, H)

      // 石砖地板
      ctx.fillStyle = '#1a2018'
      for (let x = 0; x < W; x += 32) {
        for (let y = H * 0.5; y < H; y += 16) {
          ctx.fillRect(x + 1, y + 1, 30, 14)
        }
      }
      // 砖缝
      ctx.strokeStyle = '#0f1a0f'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 32) ctx.strokeRect(x, H * 0.5, 32, H)
      for (let y = H * 0.5; y < H; y += 16) ctx.strokeRect(0, y, W, 16)

      // 污水塘
      const puddles = [
        { x: 60, y: H * 0.72, w: 70, h: 18 },
        { x: 260, y: H * 0.78, w: 50, h: 14 },
        { x: 420, y: H * 0.68, w: 60, h: 16 },
      ]
      puddles.forEach(p => {
        const ripple = Math.sin(tick * 0.05) * 2
        const grad = ctx.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 0, p.x + p.w / 2, p.y + p.h / 2, p.w / 2)
        grad.addColorStop(0, 'rgba(20,80,20,0.7)')
        grad.addColorStop(1, 'rgba(10,40,10,0.3)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2 + ripple, p.w / 2, p.h / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      })

      // 管道
      ctx.strokeStyle = '#2a4a2a'
      ctx.lineWidth = 8
      ctx.beginPath(); ctx.moveTo(0, H * 0.3); ctx.lineTo(W * 0.4, H * 0.3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(W * 0.6, H * 0.25); ctx.lineTo(W, H * 0.25); ctx.stroke()
      ctx.strokeStyle = '#1a3a1a'
      ctx.lineWidth = 5
      ctx.beginPath(); ctx.moveTo(W * 0.45, 0); ctx.lineTo(W * 0.45, H * 0.5); ctx.stroke()
      // 管道滴水
      const dropY = (tick * 2) % (H * 0.5)
      ctx.fillStyle = 'rgba(40,120,40,0.6)'
      ctx.beginPath(); ctx.arc(W * 0.45, H * 0.25 + dropY, 2, 0, Math.PI * 2); ctx.fill()

      // GPU 服务器区（右侧）
      const serverX = W * 0.72
      ctx.fillStyle = '#0d1f0d'
      ctx.fillRect(serverX, H * 0.15, W * 0.25, H * 0.5)
      ctx.strokeStyle = '#1a4a1a'
      ctx.lineWidth = 1
      ctx.strokeRect(serverX, H * 0.15, W * 0.25, H * 0.5)
      // 服务器灯
      for (let i = 0; i < 6; i++) {
        const blink = Math.sin(tick * 0.1 + i * 0.5) > 0
        ctx.fillStyle = blink ? '#00ff88' : '#003322'
        ctx.fillRect(serverX + 8, H * 0.2 + i * 14, 6, 6)
        ctx.fillStyle = blink ? '#0088ff' : '#001133'
        ctx.fillRect(serverX + 20, H * 0.2 + i * 14, 6, 6)
      }
      // GPU 标签
      ctx.fillStyle = '#00ff8844'
      ctx.font = `bold ${Math.floor(H * 0.06)}px monospace`
      ctx.fillText('GPU', serverX + 12, H * 0.1 + 5)

      // 算力进度条
      const hashrate = status?.state === 'working' ? 0.8 : status?.state === 'delegating' ? 0.95 : 0.3
      ctx.fillStyle = '#0a1a0a'
      ctx.fillRect(W * 0.05, H * 0.88, W * 0.6, 10)
      const grad2 = ctx.createLinearGradient(W * 0.05, 0, W * 0.65, 0)
      grad2.addColorStop(0, '#00ff44')
      grad2.addColorStop(1, '#00ffaa')
      ctx.fillStyle = grad2
      ctx.fillRect(W * 0.05, H * 0.88, W * 0.6 * hashrate, 10)
      ctx.fillStyle = '#00ff8899'
      ctx.font = `${Math.floor(H * 0.07)}px monospace`
      ctx.fillText(`算力 ${Math.floor(hashrate * 100)}%`, W * 0.05, H * 0.84)

      // 主龙虾 Boss（左下坐镇）
      const bossX = W * 0.08
      const bossY = H * 0.55
      const bossS = H * 0.28
      drawLobster(ctx, bossX, bossY, bossS, true, tick)

      // 电脑屏幕（Boss旁边）
      ctx.fillStyle = '#001a00'
      ctx.fillRect(bossX + bossS * 0.6, bossY - bossS * 0.5, bossS * 0.7, bossS * 0.45)
      ctx.strokeStyle = '#00ff44'
      ctx.lineWidth = 1
      ctx.strokeRect(bossX + bossS * 0.6, bossY - bossS * 0.5, bossS * 0.7, bossS * 0.45)
      // 屏幕内容
      ctx.fillStyle = '#00ff4466'
      ctx.font = `${Math.floor(H * 0.04)}px monospace`
      ctx.fillText('SOL ▲', bossX + bossS * 0.63, bossY - bossS * 0.28)
      ctx.fillStyle = '#00ff44'
      const cursor = tick % 20 < 10 ? '█' : ' '
      ctx.fillText('>' + cursor, bossX + bossS * 0.63, bossY - bossS * 0.12)

      // 小龙虾 NPC
      npcs.forEach((npc, i) => {
        // 移动
        npc.x += npc.dir * 0.5
        if (npc.x > W * 0.65 || npc.x < W * 0.05) npc.dir *= -1
        drawLobster(ctx, npc.x, H * 0.62 + i * 8, H * 0.14, false, tick + i * 30)
        // 搬运矿石
        if (npc.task === 'carry') {
          ctx.fillStyle = `rgba(0,150,255,${0.6 + Math.sin(tick * 0.1) * 0.3})`
          ctx.beginPath()
          ctx.arc(npc.x + H * 0.07, H * 0.62 + i * 8 - H * 0.1, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        if (npc.task === 'mine') {
          // 镐子动画
          const swing = Math.sin(tick * 0.2) * 15
          ctx.strokeStyle = '#aaa'
          ctx.lineWidth = 2
          ctx.save()
          ctx.translate(npc.x + H * 0.05, H * 0.62 + i * 8 - H * 0.05)
          ctx.rotate((swing * Math.PI) / 180)
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -12); ctx.stroke()
          ctx.restore()
        }
      })

      // 霓虹氛围光
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.5)
      glow.addColorStop(0, 'rgba(0,50,0,0)')
      glow.addColorStop(1, `rgba(0,20,0,${0.3 + Math.sin(tick * 0.02) * 0.05})`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, W, H)

      // 状态文字
      if (status) {
        ctx.fillStyle = '#00ff8899'
        ctx.font = `${Math.floor(H * 0.065)}px monospace`
        ctx.fillText(`🦞 ${status.detail || '待命中...'}`, W * 0.05, H * 0.97)
      }

      tick++
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [status])

  return (
    <div style={{ position: 'relative', width: '100%', background: '#0a0f0a', borderRadius: 12, overflow: 'hidden', border: '1px solid #1a4a1a' }}>
      <div style={{ padding: '8px 12px', background: '#0d1a0d', borderBottom: '1px solid #1a4a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#00ff88', fontSize: 13, fontFamily: 'monospace' }}>🦞 下水道龙虾基地</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4a8a4a', fontFamily: 'monospace' }}>
          {status ? `[${status.state?.toUpperCase()}]` : '[LOADING]'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  )
}

// 画龙虾函数
function drawLobster(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isBoss: boolean, tick: number) {
  const s = size
  const bob = Math.sin(tick * 0.08) * 2

  // 身体
  ctx.fillStyle = isBoss ? '#cc2200' : '#aa1800'
  ctx.beginPath()
  ctx.ellipse(x, y + bob, s * 0.25, s * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()

  // 头部
  ctx.beginPath()
  ctx.ellipse(x, y - s * 0.3 + bob, s * 0.2, s * 0.2, 0, 0, Math.PI * 2)
  ctx.fill()

  // 眼睛
  ctx.fillStyle = '#000'
  ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 0.38 + bob, s * 0.04, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 0.38 + bob, s * 0.04, 0, Math.PI * 2); ctx.fill()

  // boss 墨镜
  if (isBoss) {
    ctx.fillStyle = '#111'
    ctx.fillRect(x - s * 0.13, y - s * 0.42 + bob, s * 0.26, s * 0.07)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.strokeRect(x - s * 0.13, y - s * 0.42 + bob, s * 0.26, s * 0.07)
  }

  // 触角
  ctx.strokeStyle = '#cc2200'
  ctx.lineWidth = isBoss ? 1.5 : 1
  ctx.beginPath(); ctx.moveTo(x - s * 0.1, y - s * 0.45 + bob); ctx.lineTo(x - s * 0.25, y - s * 0.7 + bob); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x + s * 0.1, y - s * 0.45 + bob); ctx.lineTo(x + s * 0.25, y - s * 0.7 + bob); ctx.stroke()

  // 大钳子
  const clawSwing = Math.sin(tick * 0.06) * 5
  ctx.fillStyle = isBoss ? '#dd3311' : '#bb2200'
  // 左钳
  ctx.save()
  ctx.translate(x - s * 0.3, y - s * 0.05 + bob)
  ctx.rotate((-20 + clawSwing) * Math.PI / 180)
  ctx.beginPath(); ctx.ellipse(0, 0, s * 0.18, s * 0.1, 0, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  // 右钳
  ctx.save()
  ctx.translate(x + s * 0.3, y - s * 0.05 + bob)
  ctx.rotate((20 - clawSwing) * Math.PI / 180)
  ctx.beginPath(); ctx.ellipse(0, 0, s * 0.18, s * 0.1, 0, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // 尾巴
  ctx.fillStyle = isBoss ? '#bb1a00' : '#991500'
  ctx.beginPath()
  ctx.ellipse(x, y + s * 0.42 + bob, s * 0.15, s * 0.12, 0, 0, Math.PI * 2)
  ctx.fill()
}

// ── OpenClaw 新闻源组件 ─────────────────────────────────
function OpenClawNews() {
  const [news, setNews] = useState<Array<{ title: string; url?: string; content?: string; date?: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-openclaw?t=' + Date.now())
      .then(r => r.json())
      .then(d => {
        const items = d?.highlights || d?.news || []
        setNews(items.slice(0, 8))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ background: '#0a0f0a', border: '1px solid #1a2a3a', borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', background: '#0d1520', borderBottom: '1px solid #1a2a3a', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#00aaff', fontSize: 13, fontFamily: 'monospace' }}>📡 算力情报流</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#2a5a8a', fontFamily: 'monospace' }}>OpenClaw 动态</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {loading && <div style={{ color: '#2a5a8a', fontSize: 12, padding: '12px 16px', fontFamily: 'monospace' }}>解密情报中...</div>}
        {!loading && news.length === 0 && <div style={{ color: '#2a5a8a', fontSize: 12, padding: '12px 16px', fontFamily: 'monospace' }}>暂无情报，龙虾正在挖矿...</div>}
        {news.map((item, i) => (
          <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #0f1a2a', cursor: item.url ? 'pointer' : 'default' }}
            onClick={() => item.url && window.open(item.url, '_blank')}>
            <div style={{ color: '#88ccff', fontSize: 12, lineHeight: 1.4, marginBottom: 4 }}>{item.title}</div>
            {item.content && <div style={{ color: '#4a7aaa', fontSize: 11, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.content}</div>}
            <div style={{ color: '#2a4a6a', fontSize: 10, marginTop: 4 }}>{item.date || ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 主页 ───────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ minHeight: '100svh', background: '#060a06', color: '#e5e7eb' }}>
      {/* 顶部菜单 */}
      <nav style={{ borderBottom: '1px solid #1a2a1a', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: '#e5e7eb' }}>
          Eden<span style={{ color: '#00ff88' }}>Lab</span>
        </span>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <Link href="/skills" style={{ color: '#9ca3af', textDecoration: 'none' }}>🛠️ Web3 Skills</Link>
          <Link href="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>关于</Link>
        </div>
      </nav>

      {/* 标题区 */}
      <section style={{ padding: '24px 20px 12px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 700, marginBottom: 8 }}>
          东之伊甸的{' '}
          <span style={{ background: 'linear-gradient(to right, #00ff88, #00aaff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI & Web3
          </span>
          {' '}工具站
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>聪明钱追踪 · 链上分析 · AI 工具集合</p>
      </section>

      {/* 核心区域：龙虾基地 + 情报流 */}
      <section style={{ padding: '0 20px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,3fr) minmax(0,2fr)', gap: 16, alignItems: 'stretch' }}>
          {/* 左：龙虾基地 */}
          <SewerBase />
          {/* 右：OpenClaw 情报流 */}
          <div style={{ minHeight: 220 }}>
            <OpenClawNews />
          </div>
        </div>
      </section>

      {/* 工具入口 */}
      <section style={{ padding: '0 20px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#4b5563', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>工具集</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          <ToolCard icon="🏢" title="像素办公室" desc="多 AI 协作看板 · 状态可视化 · 昨日小记" href="/workspace" badge="LIVE" />
          <ToolCard icon="🛠️" title="Web3 Skills" desc="精选 OpenClaw Skills，含安全评级" href="/skills" badge="UPDATED" />
        </div>
      </section>

      {/* 底部留言板+日记+在线 */}
      <footer style={{ borderTop: '1px solid #1a2a1a', padding: '16px 20px', textAlign: 'center' }}>
        <OnlineStats />
        <div style={{ marginTop: 8, fontSize: 12, color: '#4b5563' }}>© 2026 EdenLab · Built by 东之伊甸</div>
      </footer>
    </main>
  )
}

function ToolCard({ icon, title, desc, href, badge }: { icon: string; title: string; desc: string; href: string; badge?: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#0d1a0d', border: '1px solid #1a4a1a', borderRadius: 12, padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          {badge && <span style={{ fontSize: 10, background: '#0f2a0f', color: '#00ff88', border: '1px solid #1a5a1a', borderRadius: 99, padding: '1px 7px', fontFamily: 'monospace' }}>{badge}</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>{desc}</div>
      </div>
    </Link>
  )
}

function OnlineStats() {
  const [stats, setStats] = useState<{ online: number; peak: number; total: number } | null>(null)
  const [sid] = useState(() => Math.random().toString(36).slice(2))
  useEffect(() => {
    const ping = () =>
      fetch('/online', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sid }) })
        .then(r => r.json()).then(setStats).catch(() => {})
    ping()
    const t = setInterval(ping, 60000)
    return () => clearInterval(t)
  }, [sid])
  if (!stats) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8, fontSize: 12, color: '#6b7280', flexWrap: 'wrap' }}>
      <span>🟢 在线 <strong style={{ color: '#4ade80' }}>{stats.online}</strong></span>
      <span>🏆 峰值 <strong style={{ color: '#ffd700' }}>{stats.peak}</strong></span>
      <span>累计 {stats.total} 次</span>
    </div>
  )
}
