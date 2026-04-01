// Simple in-memory rate limiter for client-side spam protection
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blocked: boolean;
  blockedUntil: number;
}

const entries = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_ATTEMPTS = 5;   // max attempts per window
const BLOCK_DURATION_MS = 120_000; // 2 min block

export const checkRateLimit = (key: string): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();
  const entry = entries.get(key);

  if (entry?.blocked && now < entry.blockedUntil) {
    return { allowed: false, retryAfterMs: entry.blockedUntil - now };
  }

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    entries.set(key, { count: 1, firstAttempt: now, blocked: false, blockedUntil: 0 });
    return { allowed: true, retryAfterMs: 0 };
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    entry.blocked = true;
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return { allowed: false, retryAfterMs: BLOCK_DURATION_MS };
  }

  return { allowed: true, retryAfterMs: 0 };
};

export const resetRateLimit = (key: string) => entries.delete(key);
