import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { state, message, code } = body

    // In production, store in a proper state store
    globalThis.edenLabState = { state, message, code }

    return NextResponse.json({ ok: true, state, message })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
