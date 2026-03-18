import { NextResponse } from 'next/server';

const GIST_ID = '633b3a6297f36e45a2d39e2e03360b0d';
const GIST_FILE = 'star-office-status.json';
const GITHUB_TOKEN = process.env.GITHUB_GIST_TOKEN || '';

const DEFAULT_STATE = {
  state: 'idle',
  detail: '待命中',
  officeName: '百万的办公室',
  progress: 0,
  updated_at: new Date().toISOString(),
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const secret = body.secret;
    const expectedSecret = process.env.STATUS_SECRET || '';

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GITHUB_GIST_TOKEN not configured' }, { status: 500 });
    }

    const next = {
      state: body.state || 'idle',
      detail: body.detail || body.message || '',
      message: body.detail || body.message || '',
      officeName: body.officeName || '百万的办公室',
      progress: typeof body.progress === 'number' ? body.progress : 0,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: { [GIST_FILE]: { content: JSON.stringify(next, null, 2) } },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to write gist' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...next });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
