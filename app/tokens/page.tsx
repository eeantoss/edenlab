'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Signal {
  id: number
  created_at: string
  smart_wallet: string
  wallet_alias: string | null
  token_mint: string
  token_name: string | null
  token_symbol: string | null
  action: 'BUY' | 'SELL'
  sol_amount: number | null
  our_status: 'SUCCESS' | 'FAILED' | 'SKIPPED'
  skip_reason: string | null
}

interface StatsData {
  signals: Signal[]
  wallets: { wallet: string; alias: string; buy_count: number; sell_count: number }[]
  updatedAt: string
}

const GIST_URL = 'https://gist.githubusercontent.com/dongzhiyiden/aff20d889e83475d47272e1467a278b4/raw/token-stats.json'

export default function TokensPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletFilter, setWalletFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<'all' | 'BUY' | 'SELL'>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(GIST_URL + '?t=' + Date.now(), { cache: 'no-store' })
        if (res.ok) setData(await res.json())
      } catch {}
      setLoading(false)
    }
    fetchData()
    const t = setInterval(fetchData, 30000)
    return () => clearInterval(t)
  }, [])

  const signals = (data?.signals ?? []).filter(s =>
    (walletFilter === 'all' || s.smart_wallet === walletFilter) &&
    (actionFilter === 'all' || s.action === actionFilter)
  )

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (diff < 60) return diff + '秒前'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    return Math.floor(diff / 86400) + '天前'
  }

  const shortAddr = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Eden<span className="text-emerald-400">Lab</span>
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition">首页</Link>
          <Link href="/tokens" className="text-white">聪明钱信号</Link>
          <Link href="/workspace" className="hover:text-white transition">工作状态</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">🔍 聪明钱信号追踪</h1>
          <p className="text-gray-400 text-sm">实时显示追踪钱包的买卖动作，以及是否触发跟单</p>
        </div>

        {/* 钱包统计卡片 */}
        {data?.wallets && data.wallets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {data.wallets.map(w => (
              <button
                key={w.wallet}
                onClick={() => setWalletFilter(walletFilter === w.wallet ? 'all' : w.wallet)}
                className={`text-left rounded-xl border p-3 text-xs transition ${
                  walletFilter === w.wallet
                    ? 'border-emerald-500 bg-emerald-900/20'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-white mb-1 truncate">
                  {w.alias || shortAddr(w.wallet)}
                </div>
                <div className="text-gray-500">
                  买 <span className="text-red-400">{w.buy_count}</span> · 卖 <span className="text-emerald-400">{w.sell_count}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 过滤器 */}
        <div className="flex gap-2 mb-4 items-center">
          {(['all', 'BUY', 'SELL'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActionFilter(f)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                actionFilter === f
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {f === 'all' ? '全部' : f === 'BUY' ? '🟢 买入' : '🔴 卖出'}
            </button>
          ))}
          {walletFilter !== 'all' && (
            <button onClick={() => setWalletFilter('all')} className="text-xs text-gray-500 hover:text-white ml-2">
              清除筛选 ×
            </button>
          )}
          <span className="ml-auto text-xs text-gray-600">
            {data ? '更新于 ' + timeAgo(data.updatedAt) : '加载中...'}
          </span>
        </div>

        {/* 信号列表 */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">加载中...</div>
        ) : signals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📭</div>
            <div className="text-gray-500">
              {data ? '暂无信号记录，Bot 重启后开始自动记录' : '数据加载失败'}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {signals.map(s => (
              <div
                key={s.id}
                className={`rounded-xl border p-4 transition ${
                  s.our_status === 'SKIPPED'
                    ? 'border-gray-800 bg-gray-900/30 opacity-60'
                    : s.action === 'BUY'
                    ? 'border-green-900 bg-gray-900'
                    : 'border-red-900 bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.action === 'BUY' ? '🟢' : '🔴'}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">
                          {s.wallet_alias || shortAddr(s.smart_wallet)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.action === 'BUY' ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'
                        }`}>
                          {s.action === 'BUY' ? '买入' : '卖出'}
                        </span>
                        {s.our_status === 'SKIPPED' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
                            跳过: {s.skip_reason || '未知'}
                          </span>
                        )}
                        {s.our_status === 'FAILED' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-300">跟单失败</span>
                        )}
                      </div>
                      <a
                        href={`https://solscan.io/token/${s.token_mint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-emerald-400 font-mono"
                      >
                        {s.token_name || shortAddr(s.token_mint)}
                        {s.token_symbol ? ` (${s.token_symbol})` : ''}
                      </a>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>{s.sol_amount ? s.sol_amount.toFixed(3) + ' SOL' : ''}</div>
                    <div>{timeAgo(s.created_at)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
