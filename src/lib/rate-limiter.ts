export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter?: number; // Seconds until next allowed request
}

export interface RouteTierConfig {
  limit: number;
  windowMs: number;
}

// In-memory sliding window counter store
// Key: identifier (e.g. IP or IP+tier), Value: array of timestamps (ms)
const requestLogs = new Map<string, number[]>();

// Periodic garbage collection every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanupOldEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, timestamps] of requestLogs.entries()) {
    const valid = timestamps.filter((t) => now - t < 5 * 60 * 1000);
    if (valid.length === 0) {
      requestLogs.delete(key);
    } else {
      requestLogs.set(key, valid);
    }
  }
}

/**
 * Resets the in-memory store (primarily for unit tests).
 */
export function resetRateLimitStore(): void {
  requestLogs.clear();
}

/**
 * Extracts client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Categorizes routes into rate limit tiers.
 */
export function getRouteTier(pathname: string): RouteTierConfig {
  // Sensitive auth or security routes
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth")
  ) {
    return { limit: 10, windowMs: 60 * 1000 }; // 10 req / min
  }

  // General API routes & server actions
  if (pathname.startsWith("/api")) {
    return { limit: 30, windowMs: 60 * 1000 }; // 30 req / min
  }

  // Default web UI pages
  return { limit: 120, windowMs: 60 * 1000 }; // 120 req / min
}

/**
 * Checks and records rate limit for a given identifier using sliding window.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  cleanupOldEntries();

  const now = Date.now();
  const windowStart = now - windowMs;

  const existingTimestamps = requestLogs.get(identifier) || [];
  // Filter out timestamps outside the current sliding window
  const activeTimestamps = existingTimestamps.filter((t) => t > windowStart);

  const resetTimestampSec = Math.ceil((now + windowMs) / 1000);

  if (activeTimestamps.length >= limit) {
    const oldestInWindow = activeTimestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));

    requestLogs.set(identifier, activeTimestamps);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTimestampSec,
      retryAfter: retryAfterSec,
    };
  }

  // Allow request and add current timestamp
  activeTimestamps.push(now);
  requestLogs.set(identifier, activeTimestamps);

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - activeTimestamps.length),
    reset: resetTimestampSec,
  };
}
