/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker API — D1, CORS pour front Pages / Workers.
 */

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS?: string;
}

function parseAllowedOrigins(env: Env): string[] {
  const raw =
    env.ALLOWED_ORIGINS ??
    [
      "https://thai-farang-connect.pages.dev",
      "https://thai-farang-connect.contact-applimanagement.workers.dev",
      "http://localhost:3000",
    ].join(",");
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
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const projectOne = url.pathname.match(/^\/v1\/projects\/([^/]+)$/);

    if (request.method === "GET" && projectOne) {
      const id = projectOne[1];
      try {
        const row = await env.DB.prepare(
          `SELECT id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects
           WHERE id = ? AND status = 'published'`,
        )
          .bind(id)
          .first();

        if (!row) {
          const res = Response.json({ error: "Not found" }, { status: 404 });
          return withCors(request, env, res);
        }

        const res = Response.json({ project: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = Response.json({ error: msg }, { status: 500 });
        return withCors(request, env, res);
      }
    }

    if (request.method === "GET" && url.pathname === "/v1/projects") {
      try {
        const { results } = await env.DB.prepare(
          `SELECT id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects
           WHERE status = 'published'
           ORDER BY created_at DESC
           LIMIT 50`,
        ).all();

        const res = Response.json({
          projects: results ?? [],
        });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = Response.json({ error: msg }, { status: 500 });
        return withCors(request, env, res);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/leads") {
      try {
        const body = (await request.json()) as {
          email?: string;
          role?: string;
          locale?: string;
          message?: string;
          project_id?: string | null;
        };

        const email = String(body.email ?? "").trim().toLowerCase();
        const role = body.role;
        const locale = body.locale ? String(body.locale).slice(0, 8) : null;
        const message = body.message
          ? String(body.message).trim().slice(0, 2000)
          : null;
        const projectId =
          body.project_id && typeof body.project_id === "string"
            ? body.project_id.trim().slice(0, 64)
            : null;

        if (!email || !EMAIL_RE.test(email)) {
          const res = Response.json(
            { error: "Invalid email" },
            { status: 400 },
          );
          return withCors(request, env, res);
        }

        if (
          role !== "investor_thai" &&
          role !== "entrepreneur_farang"
        ) {
          const res = Response.json(
            { error: "Invalid role" },
            { status: 400 },
          );
          return withCors(request, env, res);
        }

        if (projectId) {
          const exists = await env.DB.prepare(
            `SELECT id FROM projects WHERE id = ? AND status = 'published'`,
          )
            .bind(projectId)
            .first();
          if (!exists) {
            const res = Response.json(
              { error: "Unknown or unpublished project" },
              { status: 400 },
            );
            return withCors(request, env, res);
          }
        }

        const id = crypto.randomUUID();

        await env.DB.prepare(
          `INSERT INTO lead_intents (id, email, role, locale, message, project_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
          .bind(id, email, role, locale, message, projectId)
          .run();

        const res = Response.json({ ok: true, id }, { status: 201 });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = Response.json({ error: msg }, { status: 400 });
        return withCors(request, env, res);
      }
    }

    const plain = new Response(
      "Thai-Farang API — GET /health, /v1/projects, /v1/projects/:id — POST /v1/leads",
      {
        headers: { "content-type": "text/plain;charset=UTF-8" },
      },
    );
    return withCors(request, env, plain);
  },
};

export default worker;
