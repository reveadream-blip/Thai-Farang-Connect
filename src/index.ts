/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker API — D1, CORS pour https://thai-farang-connect.pages.dev
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS?: string;
}

function parseAllowedOrigins(env: Env): string[] {
  const fallback = "https://thai-farang-connect.pages.dev";
  const raw = env.ALLOWED_ORIGINS ?? fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsForRequest(request: Request, env: Env): Headers {
  const headers = new Headers();
  const origin = request.headers.get("Origin");
  const allowed = parseAllowedOrigins(env);
  if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return headers;
}

function withCors(request: Request, env: Env, response: Response): Response {
  const out = new Headers(response.headers);
  const cors = corsForRequest(request, env);
  cors.forEach((value, key) => {
    out.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: out,
  });
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsForRequest(request, env),
      });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      const res = Response.json({
        ok: true,
        environment: env.ENVIRONMENT,
      });
      return withCors(request, env, res);
    }

    const plain = new Response("Thai-Farang API", {
      headers: { "content-type": "text/plain;charset=UTF-8" },
    });
    return withCors(request, env, plain);
  },
};

export default worker;
