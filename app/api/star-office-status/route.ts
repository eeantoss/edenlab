import { NextResponse } from 'next/server';

const GIST_ID = '633b3a6297f36e45a2d39e2e03360b0d';
const GIST_FILE = 'star-office-status.json';
const GITHUB_TOKEN = process.env.GITHUB_GIST_TOKEN || '';

// 内存缓存，减少 GitHub API 请求
let readCache: { data: Record<string, unknown> | null; ts: number } = { data: null, ts: 0 };
const READ_CACHE_TTL = 10_000; // 10 秒读缓存

const DEFAULT_STATE = {
  state: 'idle',
  detail: '待命中',
  officeName: '百万的办公室',
  progress: 0,
  updated_at: new Date().toISOString(),
};

async function readGist(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (readCache.data && now - readCache.ts < READ_CACHE_TTL) {
    return readCache.data;
  }

  if (!GITHUB_TOKEN) return { ...DEFAULT_STATE };

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return { ...DEFAULT_STATE };

    const gist = await res.json();
    const content = gist.files?.[GIST_FILE]?.content;
    if (!content) return { ...DEFAULT_STATE };

    const data = JSON.parse(content);
    readCache = { data, ts: now };
    return data;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function writeGist(state: Record<string, unknown>): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: { [GIST_FILE]: { content: JSON.stringify(state, null, 2) } },
      }),
    });

    if (res.ok) {
      readCache = { data: state, ts: Date.now() };
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function GET() {
  const state = await readGist();
  return NextResponse.json({
    state: state.state || 'idle',
    detail: state.detail || state.message || '',
    officeName: state.officeName || '百万的办公室',
    progress: typeof state.progress === 'number' ? state.progress : 0,
    updated_at: state.updated_at || new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const secret = body.secret;
    const expectedSecret = process.env.STATUS_SECRET || '';

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const current = await readGist();
    const next = {
      ...current,
      state: body.state || current.state || 'idle',
      detail: body.detail || body.message || current.detail || '',
      message: body.detail || body.message || current.message || '',
      officeName: body.officeName || current.officeName || '百万的办公室',
      progress: typeof body.progress === 'number' ? body.progress : (current.progress || 0),
      updated_at: new Date().toISOString(),
    };

    const ok = await writeGist(next);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to write status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ...next });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
