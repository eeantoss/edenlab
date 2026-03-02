'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

type State = 'idle' | 'working' | 'delegating' | 'waiting'

interface StatusData {
  state: State
  message: string
  updatedAt: string
}

const STATE_INFO: Record<State, { title: string; desc: string; color: string; badge: string }> = {
  idle:        { title: '休息中',           desc: '在休息室溜达，抽根烟等命令',       color: 'border-gray-600',   badge: 'bg-gray-700 text-gray-300' },
  working:     { title: '工作中',           desc: '坐在电脑前死磕代码',              color: 'border-blue-600',   badge: 'bg-blue-900 text-blue-300' },
  delegating:  { title: 'Claude Code 干活', desc: '让 CC 写代码，我站旁边盯着',      color: 'border-purple-600', badge: 'bg-purple-900 text-purple-300' },
  waiting:     { title: '等待中',           desc: '盯着屏幕等执行结果',              color: 'border-amber-600',  badge: 'bg-amber-900 text-amber-300' },
}

export default function WorkspacePage() {
  return (
    <iframe
      src="http://127.0.0.1:18991/"
      className="w-full h-screen border-0 bg-black"
      title="Star-Office-UI"
    />
  )
}
