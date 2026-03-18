import { NextResponse } from 'next/server';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MEMORY_DIR = join(process.cwd(), 'data', 'memory');

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const yesterday = getYesterdayStr();
    const targetFile = join(MEMORY_DIR, `${yesterday}.md`);

    let content = '';
    let date = yesterday;

    try {
      content = readFileSync(targetFile, 'utf-8');
    } catch {
      // 找最近的文件
      try {
        const files = readdirSync(MEMORY_DIR)
          .filter(f => f.endsWith('.md') && /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
          .sort()
          .reverse();

        const today = new Date().toISOString().slice(0, 10);
        const recent = files.find(f => f.replace('.md', '') < today);
        if (recent) {
          content = readFileSync(join(MEMORY_DIR, recent), 'utf-8');
          date = recent.replace('.md', '');
        }
      } catch { /* empty dir */ }
    }

    if (!content) {
      return NextResponse.json({ success: false, memo: '', date: '' });
    }

    // 提取要点，去掉标题行
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('# '));
    const summary = lines.slice(0, 15).join('\n');

    return NextResponse.json({ success: true, memo: summary, date });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, memo: '', error: msg });
  }
}
