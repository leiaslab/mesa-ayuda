type RateLimitOptions = {
  key: string;
  windowMs: number;
  max: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __mesaAyudaRateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalStore.__mesaAyudaRateLimitStore ?? new Map<string, RateLimitEntry>();
globalStore.__mesaAyudaRateLimitStore = store;

export function consumeRateLimit({ key, windowMs, max }: RateLimitOptions) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    store.set(key, next);

    return {
      allowed: true,
      remaining: Math.max(0, max - next.count),
      resetAt: next.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: current.count <= max,
    remaining: Math.max(0, max - current.count),
    resetAt: current.resetAt,
  };
}
