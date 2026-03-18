import { NextResponse } from 'next/server';

const OPENNEWS_TOKEN = process.env.OPENNEWS_TOKEN || '';
const API_URL = 'https://ai.6551.io/open/news_search';
const CACHE_TTL = 300_000; // 5 minutes

let cache: { data: unknown; ts: number } = { data: null, ts: 0 };

export async function GET() {
  if (!OPENNEWS_TOKEN) {
    return NextResponse.json({ error: 'OPENNEWS_TOKEN not configured' });
  }

  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENNEWS_TOKEN}`,
      },
      body: JSON.stringify({ coins: ['BTC'], limit: 10, hasCoin: true }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `6551 API error: ${res.status}` });
    }

    const json = await res.json();
    const articles = (json.data || []).map((item: Record<string, unknown>) => ({
      title: item.title || '',
      source: item.source || '',
      url: item.url || '',
      sentiment: item.sentiment || item.score || null,
      published_at: item.published_at || item.publishedAt || item.created_at || '',
    }));

    const data = { articles, updated_at: new Date().toISOString() };
    cache = { data, ts: now };
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg });
  }
}
