type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function takeRateLimit(request: Request, namespace: string, limit: number, windowMs: number) {
  const now = Date.now();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = request.headers.get("x-real-ip") || forwarded || "unknown";
  const key = `${namespace}:${address}`;
  const previous = buckets.get(key);
  if (!previous || previous.resetAt <= now) {
    if (buckets.size > 5000) for (const [candidate, entry] of buckets) if (entry.resetAt <= now) buckets.delete(candidate);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (previous.count >= limit) return { allowed: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((previous.resetAt - now) / 1000)) };
  previous.count += 1;
  return { allowed: true, remaining: limit - previous.count, retryAfter: 0 };
}
