export type AssetTask = {
  task_id: string;
  status: 'pending' | 'done' | 'error';
  ok: boolean;
  msg?: string;
  image_url?: string;
  path?: string;
  created_at: number;
};

type TaskStore = typeof globalThis & { __edenlabAssetTasks?: Record<string, AssetTask> };
const store = globalThis as TaskStore;

function tasks() {
  if (!store.__edenlabAssetTasks) store.__edenlabAssetTasks = {};
  return store.__edenlabAssetTasks;
}

export function createTask(seed?: Partial<AssetTask>) {
  const task_id = `task_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const task: AssetTask = {
    task_id,
    status: 'pending',
    ok: true,
    created_at: Date.now(),
    ...seed,
  };
  tasks()[task_id] = task;
  return task;
}

export function getTask(taskId: string) {
  return tasks()[taskId] || null;
}

export function finishTask(taskId: string, patch: Partial<AssetTask>) {
  const cur = tasks()[taskId];
  if (!cur) return null;
  const next = { ...cur, ...patch };
  tasks()[taskId] = next;
  return next;
}
