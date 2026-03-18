import { NextResponse } from 'next/server';

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || '';
const CACHE_TTL = 30_000; // 30 seconds

let cache: { data: Record<string, unknown> | null; ts: number } = { data: null, ts: 0 };

async function rpc(method: string, params: unknown[] = []) {
  const res = await fetch(POLYGON_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const json = await res.json();
  return json.result || '0x0';
}

export async function GET() {
  if (!POLYGON_RPC_URL) {
    return NextResponse.json({ error: 'POLYGON_RPC_URL not configured' });
  }

  const now = Date.now();
  if (cache.data && now - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const [blockHex, gasHex] = await Promise.all([
      rpc('eth_blockNumber'),
      rpc('eth_gasPrice'),
    ]);

    const data = {
      block: parseInt(blockHex, 16),
      gas_gwei: Math.round((parseInt(gasHex, 16) / 1e9) * 100) / 100,
      chain_id: 137,
      updated_at: new Date().toISOString(),
    };

    cache = { data, ts: now };
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, updated_at: new Date().toISOString() });
  }
}
