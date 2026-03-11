'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function WorkspacePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<{ state: string; detail: string } | null>(null)

  // 读取状态
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/star-office-status', { cache: 'no-store' })
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Failed to fetch status:', err)
    }
  }

  useEffect(() => {
    fetchStatus()
    const t = setInterval(fetchStatus, 30000)
    return () => clearInterval(t)
  }, [])

  // 设置状态
  const setStarState = async (state: string, detail: string) => {
    try {
      const res = await fetch('/api/star-office-set-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, detail }),
      })
      const data = await res.json()
      if (data.ok) {
        fetchStatus() // 刷新状态
      }
    } catch (err) {
      console.error('Failed to set state:', err)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0a0f0a', color: '#e5e7eb' }}>
      {/* 顶部控制栏 */}
      <div style={{
        padding: '8px 16px',
        background: '#0d1a0d',
        borderBottom: '1px solid #1a2a1a',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>🏢 像素办公室</h1>
        {status && (
          <span style={{
            fontSize: 12,
            color: '#6b7280',
            marginLeft: 'auto'
          }}>
            {status.state.toUpperCase()}: {status.detail}
          </span>
        )}

        {/* 快捷状态设置按钮 */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setStarState('idle', '待命中，随时准备为你服务')}
            style={{ padding: '4px 10px', fontSize: 11, background: '#0f2a0f', color: '#00ff88', border: '1px solid #1a5a1a', borderRadius: 4, cursor: 'pointer' }}
          >
            待命
          </button>
          <button
            onClick={() => setStarState('writing', '正在帮你整理文档')}
            style={{ padding: '4px 10px', fontSize: 11, background: '#0a2a1a', color: '#00aaff', border: '1px solid #1a4a2a', borderRadius: 4, cursor: 'pointer' }}
          >
            工作中
          </button>
          <button
            onClick={() => setStarState('syncing', '同步进度中')}
            style={{ padding: '4px 10px', fontSize: 11, background: '#0a2a2a', color: '#aaaaff', border: '1px solid #1a2a4a', borderRadius: 4, cursor: 'pointer' }}
          >
            同步中
          </button>
          <button
            onClick={() => setStarState('error', '发现问题，正在排查')}
            style={{ padding: '4px 10px', fontSize: 11, background: '#2a1a0a', color: '#ff8844', border: '1px solid #4a2a1a', borderRadius: 4, cursor: 'pointer' }}
          >
            报错中
          </button>
        </div>
      </div>

      {/* 办公室 iframe */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 52px)' }}>
        <iframe
          src="/star-office/index.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            display: loading ? 'none' : 'block'
          }}
          onLoad={() => setLoading(false)}
          onError={() => setError('加载失败')}
        />
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: 18,
            color: '#6b7280',
            background: '#0a0f0a'
          }}>
            加载中...
          </div>
        )}
        {error && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: 16,
            color: '#ff8844',
            background: '#0a0f0a'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}