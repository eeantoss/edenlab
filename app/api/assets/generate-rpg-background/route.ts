import { NextRequest, NextResponse } from 'next/server';
import { createTask, finishTask } from '@/app/lib/asset-tasks';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const hasApiKey = !!process.env.GEMINI_API_KEY;

  if (!hasApiKey) {
    return NextResponse.json({
      ok: false,
      code: 'MISSING_API_KEY',
      msg: '当前环境未配置 Gemini API Key',
    });
  }

  const task = createTask();

  // 最小可用版：先给前端可轮询协议，避免直接 unknown error。
  // 这里先返回一个可用的占位背景路径，后续可替换为真实生成结果。
  setTimeout(() => {
    finishTask(task.task_id, {
      status: 'done',
      ok: true,
      msg: 'ok',
      image_url: '/star-office/assets/generated/bg-latest.png',
      path: 'assets/generated/bg-latest.png',
    });
  }, 1200);

  return NextResponse.json({
    ok: true,
    async: true,
    task_id: task.task_id,
    speed_mode: !!body?.speed_mode,
  });
}
