import { NextRequest, NextResponse } from 'next/server'

declare global {
  var edenLabState: { state: string; message: string } | null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { state, message, code } = body

    // Store in global (production should use DB)
    globalThis.edenLabState = { state, message }

    return NextResponse.json({ ok: true, state, message, code })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
