import type { Env } from "./env";

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(s),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function incrementBucket(
  db: D1Database,
  bucket: string,
): Promise<number> {
  await db
    .prepare(
      `INSERT INTO lead_rate_buckets (bucket, hits) VALUES (?, 1)
       ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1`,
    )
    .bind(bucket)
    .run();
  const row = await db
    .prepare(`SELECT hits FROM lead_rate_buckets WHERE bucket = ?`)
    .bind(bucket)
    .first<{ hits: number }>();
  return row?.hits ?? 1;
}

/** Limite par IP (requête/minute). Retourne Response 429 ou null. */
export async function gateLeadIp(
  env: Env,
  request: Request,
): Promise<Response | null> {
  const rawIp =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown";
  const minute = Math.floor(Date.now() / 60_000);
  const ipHash = await sha256Hex(rawIp);
  const bucket = `lead:ip:${ipHash}:${minute}`;
  const hits = await incrementBucket(env.DB, bucket);
  const maxIp = 45;
  if (hits > maxIp) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json;charset=UTF-8" },
    });
  }
  return null;
}

/** Limite par email une fois l’email validé. */
export async function gateLeadEmail(
  env: Env,
  email: string,
): Promise<Response | null> {
  const minute = Math.floor(Date.now() / 60_000);
  const emHash = await sha256Hex(email.trim().toLowerCase());
  const bucket = `lead:em:${emHash}:${minute}`;
  const hits = await incrementBucket(env.DB, bucket);
  const maxEm = 8;
  if (hits > maxEm) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json;charset=UTF-8" },
    });
  }
  return null;
}
