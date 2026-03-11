'use client'

import { useEffect, useState } from 'react'

export default function WorkspacePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
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
          height: '100vh',
          fontSize: '24px',
          color: '#666'
        }}>
          加载中...
        </div>
      )}
      {error && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#ff0000'
        }}>
          {error}
        </div>
      )}
    </div>
  )
}