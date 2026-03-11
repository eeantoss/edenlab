import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:19000/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to proxy to Flask backend' }, { status: 500 })
  }
}