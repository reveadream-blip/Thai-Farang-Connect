/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker API — secure handling of business plans & platform data.
 * Bind D1 as `DB` in wrangler.toml and run migrations against D1 before deploy.
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({
        ok: true,
        environment: env.ENVIRONMENT,
      });
    }

    return new Response("Thai-Farang API", {
      headers: { "content-type": "text/plain;charset=UTF-8" },
    });
  },
};

export default worker;
