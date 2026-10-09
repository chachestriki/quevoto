const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const num = (v: string | undefined, d: number) => (Number(v) > 0 ? Number(v) : d);
export const LIMITS = {
  hour: num(process.env.RATE_LIMIT_HOUR, 10),
  day: num(process.env.RATE_LIMIT_DAY, 30),
  globalDay: num(process.env.GLOBAL_DAILY_LIMIT, 2000),
};

const mem = new Map<string, { n: number; exp: number }>();

async function redis(cmds: (string | number)[][]): Promise<unknown[] | null> {
  if (!url || !token) return null;
  try {
    const r = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(cmds),
      cache: "no-store",
    });
    if (!r.ok) return null;
    return ((await r.json()) as { result: unknown }[]).map((x) => x.result);
  } catch {
    return null;
  }
}

async function incr(key: string, ttl: number): Promise<number> {
  const res = await redis([["INCR", key], ["EXPIRE", key, ttl, "NX"]]);
  if (res) return Number(res[0]);
  const now = Date.now();
  const cur = mem.get(key);
  const e = cur && cur.exp > now ? cur : { n: 0, exp: now + ttl * 1000 };
  e.n++;
  mem.set(key, e);
  if (mem.size > 50_000) for (const [k, v] of mem) if (v.exp < now) mem.delete(k);
  return e.n;
}

export function clientIp(req: Request) {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anon";
}

export async function checkUser(ip: string): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const hour = new Date().toISOString().slice(0, 13);
  const [h, d] = await Promise.all([incr(`rl:h:${hour}:${ip}`, 3600), incr(`rl:d:${day}:${ip}`, 86400)]);
  return h <= LIMITS.hour && d <= LIMITS.day;
}

export async function takeGlobalAi(): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  return (await incr(`rl:g:${day}`, 86400)) <= LIMITS.globalDay;
}

const memCache = new Map<string, string>();

export async function cacheGet(key: string): Promise<string | null> {
  const res = await redis([["GET", `c:${key}`]]);
  if (res) return (res[0] as string | null) ?? null;
  return memCache.get(key) ?? null;
}

export async function cacheSet(key: string, value: string) {
  const res = await redis([["SET", `c:${key}`, value, "EX", 60 * 60 * 24 * 7]]);
  if (res) return;
  if (memCache.size > 500) memCache.delete(memCache.keys().next().value!);
  memCache.set(key, value);
}
