export type OfficeState = {
  state: string;
  detail?: string;
  message?: string;
  officeName?: string;
  progress?: number;
  updated_at?: string;
  updatedAt?: number;
};

type OfficeStateStore = typeof globalThis & {
  __edenlabOfficeState?: OfficeState;
};

const store = globalThis as OfficeStateStore;

const DEFAULT_STATE: OfficeState = {
  state: 'idle',
  detail: '待命中',
  message: '',
  officeName: '百万的办公室',
  progress: 0,
  updated_at: new Date().toISOString(),
  updatedAt: Date.now(),
};

export function getOfficeState(): OfficeState {
  return store.__edenlabOfficeState || { ...DEFAULT_STATE };
}

export function setOfficeState(input: Partial<OfficeState>) {
  const current = getOfficeState();
  const state = input.state || current.state || 'idle';
  const detail = input.detail ?? input.message ?? current.detail ?? current.message ?? '';
  const next: OfficeState = {
    ...current,
    ...input,
    state,
    detail,
    message: detail,
    officeName: input.officeName || current.officeName || '百万的办公室',
    progress: typeof input.progress === 'number' ? input.progress : (typeof current.progress === 'number' ? current.progress : 0),
    updated_at: new Date().toISOString(),
    updatedAt: Date.now(),
  };
  store.__edenlabOfficeState = next;
  return next;
}
