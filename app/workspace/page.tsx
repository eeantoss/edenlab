'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

type State = 'idle' | 'working' | 'delegating' | 'waiting'

interface StatusData {
  state: State
  message: string
  updatedAt: string
}

// 像素画场景用 ASCII + emoji 拼接，用 canvas 渲染
const SCENES: Record<State, { title: string; emoji: string; desc: string; scene: string[] }> = {
  idle: {
    title: '休息中',
    emoji: '🚬',
    desc: '在休息室抽根烟，等你发号施令',
    scene: [
      '┌─────────────────────────┐',
      '│  休  息  室              │',
      '│                         │',
      '│  🚰 饮水机               │',
      '│                         │',
      '│      🧍                 │',
      '│      🚬  ~~~            │',
      '│                         │',
      '│  🛋️  沙发               │',
      '│                         │',
      '└─────────────────────────┘',
    ]
  },
  working: {
    title: '修复中',
    emoji: '💻',
    desc: '坐在工位前死磕代码',
    scene: [
      '┌─────────────────────────┐',
      '│  工  位                  │',
      '│                         │',
      '│  ┌───────────┐          │',
      '│  │ > npm run │  💻      │',
      '│  │ > fix bug │          │',
      '│  └───────────┘          │',
      '│       🧑‍💻               │',
      '│    ╔═══════╗            │',
      '│    ║  桌子  ║            │',
      '└─────────────────────────┘',
    ]
  },
  delegating: {
    title: 'Claude Code 干活',
    emoji: '👀',
    desc: '让 Claude Code 写代码，我在旁边盯着',
    scene: [
      '┌─────────────────────────┐',
      '│  双  工  位              │',
      '│                         │',
      '│  💻 Claude Code         │',
      '│  ┌──────────┐           │',
      '│  │ writing..│  🤖       │',
      '│  └──────────┘           │',
      '│              👀 🧍      │',
      '│              Dean       │',
      '│           (监工中)       │',
      '└─────────────────────────┘',
    ]
  },
  waiting: {
    title: '等待结果',
    emoji: '⏳',
    desc: '盯着屏幕等命令执行完',
    scene: [
      '┌─────────────────────────┐',
      '│  工  位                  │',
      '│                         │',
      '│  ┌───────────┐          │',
      '│  │ loading.. │  ⏳      │',
      '│  │ ▓▓▓░░░░░░ │          │',
      '│  └───────────┘          │',
      '│       😮                │',
      '│    ╔═══════╗            │',
      '│    ║  桌子  ║            │',
      '└─────────────────────────┘',
    ]
  }
}

const STATE_COLORS: Record<State, string> = {
  idle: 'from-gray-800 to-gray-900 border-gray-600',
  working: 'from-blue-900 to-gray-900 border-blue-500',
  delegating: 'from-purple-900 to-gray-900 border-purple-500',
  waiting: 'from-amber-900 to-gray-900 border-amber-500',
}

const STATE_BADGE: Record<State, string> = {
  idle: 'bg-gray-600 text-gray-200',
  working: 'bg-blue-600 text-blue-100',
  delegating: 'bg-purple-600 text-purple-100',
  waiting: 'bg-amber-600 text-amber-100',
}

export default function WorkspacePage() {
  const [status, setStatus] = useState<StatusData>({
    state: 'idle',
    message: '等待命令...',
    updatedAt: new Date().toISOString()
  })
  const [blink, setBlink] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 轮询状态
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/status', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch {}
    }

    fetchStatus()
    intervalRef.current = setInterval(fetchStatus, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  // 闪烁动画
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 800)
    return () => clearInterval(t)
  }, [])

  const scene = SCENES[status.state]
  const colorClass = STATE_COLORS[status.state]
  const badgeClass = STATE_BADGE[status.state]

  const timeAgo = () => {
    const diff = Math.floor((Date.now() - new Date(status.updatedAt).getTime()) / 1000)
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    return `${Math.floor(diff / 3600)}小时前`
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Eden<span className="text-emerald-400">Lab</span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">首页</Link>
          <Link href="/workspace" className="text-white">工作状态</Link>
          <Link href="/about" className="hover:text-white transition">关于</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            🤖 Dean 的实时工作状态
          </h1>
          <p className="text-gray-400">你的 AI 助手现在在干什么？每5秒更新一次</p>
        </div>

        {/* 主场景卡片 */}
        <div className={`rounded-2xl border bg-gradient-to-br ${colorClass} p-6 mb-6 transition-all duration-700`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{scene.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${badgeClass}`}>
                  {status.state.toUpperCase()}
                </span>
                <span className={`w-2 h-2 rounded-full ${blink ? 'opacity-100' : 'opacity-20'} ${
                  status.state === 'idle' ? 'bg-gray-400' :
                  status.state === 'working' ? 'bg-blue-400' :
                  status.state === 'delegating' ? 'bg-purple-400' : 'bg-amber-400'
                }`} />
              </div>
              <h2 className="text-xl font-bold mt-1">{scene.title}</h2>
            </div>
          </div>

          {/* 像素画场景 */}
          <div className="bg-black/40 rounded-xl p-4 mb-4 font-mono text-sm leading-relaxed overflow-x-auto">
            {scene.scene.map((line, i) => (
              <div key={i} className="whitespace-pre text-green-300">{line}</div>
            ))}
          </div>

          {/* 状态描述 */}
          <p className="text-gray-300 text-sm">{scene.desc}</p>
          {status.message && (
            <div className="mt-3 bg-black/30 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono">
              <span className="text-emerald-400">{'>'} </span>{status.message}
            </div>
          )}
        </div>

        {/* 元信息 */}
        <div className="flex gap-4 text-xs text-gray-500">
          <span>🕐 最后更新：{timeAgo()}</span>
          <span>🔄 每5秒自动刷新</span>
        </div>

        {/* 状态说明 */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {(Object.entries(SCENES) as [State, typeof SCENES[State]][]).map(([key, val]) => (
            <div
              key={key}
              className={`rounded-xl border p-3 text-sm transition-all ${
                status.state === key
                  ? 'border-emerald-500 bg-emerald-900/20'
                  : 'border-gray-800 bg-gray-900/50 opacity-50'
              }`}
            >
              <span className="text-lg mr-2">{val.emoji}</span>
              <span className="font-medium">{val.title}</span>
              <p className="text-gray-400 text-xs mt-1">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
