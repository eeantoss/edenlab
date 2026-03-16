import { NextRequest, NextResponse } from 'next/server';
import { getTask } from '@/app/lib/asset-tasks';

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('task_id') || '';
  if (!taskId) {
    return NextResponse.json({ ok: false, status: 'error', msg: 'missing task_id' }, { status: 400 });
  }

  const task = getTask(taskId);
  if (!task) {
    return NextResponse.json({ ok: false, status: 'error', msg: 'task not found' }, { status: 404 });
  }

  if (task.status === 'pending') {
    return NextResponse.json({ ok: true, status: 'pending', task_id: task.task_id });
  }

  if (task.status === 'error') {
    return NextResponse.json({ ok: false, status: 'error', task_id: task.task_id, msg: task.msg || 'generation failed' });
  }

  return NextResponse.json({
    ok: true,
    status: 'done',
    task_id: task.task_id,
    image_url: task.image_url,
    path: task.path,
    msg: task.msg || 'ok',
  });
}
