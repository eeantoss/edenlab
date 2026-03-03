import { NextResponse } from 'next/server'

// GitHub Gist 配置
const GIST_ID = process.env.GIST_ID || ''
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

// 用于读取原始文件（不需要 token）
const RAW_BASE = `https://gist.githubusercontent.com/eeantoss/${GIST_ID}/raw`

export const revalidate = 0

// 默认状态
const DEFAULT_STATUS = {
  state: 'idle',
  message: '等待命令...',
  updatedAt: new Date().toISOString()
}

export async function GET() {
  // 如果没有配置 Gist，返回默认状态
  if (!GIST_ID) {
    console.warn('Gist not configured, returning default status')
    return NextResponse.json(DEFAULT_STATUS, {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    })
  }

  try {
    // 加时间戳防缓存
    const res = await fetch(`${RAW_BASE}/edenlab-status.json?t=${Date.now()}`, {
      next: { revalidate: 0 },
      headers: { 'Cache-Control': 'no-cache' }
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
      })
    }

    console.warn('Gist fetch failed, returning default status')
    return NextResponse.json(DEFAULT_STATUS, {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error) {
    console.error('Error reading from Gist:', error)
    return NextResponse.json(DEFAULT_STATUS, {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    })
  }
}
