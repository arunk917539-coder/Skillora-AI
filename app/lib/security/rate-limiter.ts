/**
 * In-memory sliding-window rate limiter for sensitive endpoints.
 * Protects against brute-force authentication and Ollama evaluation queue exhaustion.
 *
 * In distributed multi-instance production environments, replace with an external
 * Redis-backed token bucket (e.g. Upstash Redis).
 */

type RateLimitRecord = {
  timestamps: number[];
};

const store = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
};

/**
 * Checks if a key has exceeded its allowed number of actions within windowMs.
 *
 * @param key Identifier for the actor (e.g. `ip:127.0.0.1` or `user:cuid123`)
 * @param limit Maximum allowed events in the window
 * @param windowMs Duration of the sliding window in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanupExpired(windowMs);

  const now = Date.now();
  const record = store.get(key) || { timestamps: [] };

  // Retain only timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  store.set(key, record);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}
