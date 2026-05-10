/// <reference types="@cloudflare/workers-types" />

import type { Env } from "./env";
import { gateLeadEmail, gateLeadIp } from "./leadRateLimit";
import { signUserJwt, verifyUserJwt, type UserJwtClaims } from "./jwtWorker";
import { hashPassword, verifyPassword } from "./password";

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

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json;charset=UTF-8" },
  });
}

function jwtErrorResponse(): Response {
  return json({ error: "Authentication not configured" }, 503);
}

async function readClaims(
  request: Request,
  env: Env,
): Promise<UserJwtClaims | Response> {
  try {
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const token = auth.slice(7).trim();
    if (!token) return json({ error: "Unauthorized" }, 401);
    let claims: UserJwtClaims | null;
    try {
      claims = await verifyUserJwt(env, token);
    } catch {
      return jwtErrorResponse();
    }
    if (!claims) return json({ error: "Invalid token" }, 401);
    return claims;
  } catch {
    return jwtErrorResponse();
  }
}

function canManageProject(
  claims: UserJwtClaims,
  ownerId: string | null,
): boolean {
  if (claims.role === "admin") return true;
  return claims.sub === ownerId;
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
          const res = json({ error: "Not found" }, 404);
          return withCors(request, env, res);
        }

        const res = json({ project: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = json({ error: msg }, 500);
        return withCors(request, env, res);
      }
    }

    const manageOne = url.pathname.match(/^\/v1\/manage\/projects\/([^/]+)$/);

    if (request.method === "GET" && manageOne) {
      const id = manageOne[1];
      const claimsOrRes = await readClaims(request, env);
      if (claimsOrRes instanceof Response) {
        return withCors(request, env, claimsOrRes);
      }
      try {
        const row = await env.DB.prepare(
          `SELECT id, owner_id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects WHERE id = ?`,
        )
          .bind(id)
          .first<{
            id: string;
            owner_id: string | null;
            title_en: string;
            title_th: string;
            description_en: string;
            description_th: string;
            industry: string;
            location: string | null;
            required_investment: number | null;
            equity_offered: number | null;
            status: string;
            created_at: string;
          }>();

        if (!row) {
          const res = json({ error: "Not found" }, 404);
          return withCors(request, env, res);
        }
        if (!canManageProject(claimsOrRes, row.owner_id)) {
          const res = json({ error: "Forbidden" }, 403);
          return withCors(request, env, res);
        }
        const res = json({ project: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = json({ error: msg }, 500);
        return withCors(request, env, res);
      }
    }

    if (request.method === "PATCH" && manageOne) {
      const id = manageOne[1];
      const claimsOrRes = await readClaims(request, env);
      if (claimsOrRes instanceof Response) {
        return withCors(request, env, claimsOrRes);
      }
      try {
        const existing = await env.DB.prepare(
          `SELECT owner_id FROM projects WHERE id = ?`,
        )
          .bind(id)
          .first<{ owner_id: string | null }>();

        if (!existing) {
          const res = json({ error: "Not found" }, 404);
          return withCors(request, env, res);
        }
        if (!canManageProject(claimsOrRes, existing.owner_id)) {
          const res = json({ error: "Forbidden" }, 403);
          return withCors(request, env, res);
        }

        const body = (await request.json()) as Record<string, unknown>;
        const updates: string[] = [];
        const binds: unknown[] = [];

        const str = (k: string, max: number) => {
          const v = body[k];
          if (typeof v !== "string") return;
          const s = v.trim().slice(0, max);
          updates.push(`${k} = ?`);
          binds.push(s);
        };

        str("title_en", 500);
        str("title_th", 500);
        str("description_en", 20000);
        str("description_th", 20000);
        str("industry", 200);
        str("location", 200);

        if (typeof body.required_investment === "number") {
          updates.push("required_investment = ?");
          binds.push(body.required_investment);
        } else if (body.required_investment === null) {
          updates.push("required_investment = ?");
          binds.push(null);
        }

        if (typeof body.equity_offered === "number") {
          updates.push("equity_offered = ?");
          binds.push(body.equity_offered);
        } else if (body.equity_offered === null) {
          updates.push("equity_offered = ?");
          binds.push(null);
        }

        if (typeof body.status === "string") {
          const st = body.status.trim();
          const allowed = ["draft", "published", "funded", "archived"];
          if (allowed.includes(st)) {
            updates.push("status = ?");
            binds.push(st);
          }
        }

        if (updates.length === 0) {
          const res = json({ error: "No valid fields" }, 400);
          return withCors(request, env, res);
        }

        const sql = `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`;
        binds.push(id);
        await env.DB.prepare(sql)
          .bind(...binds)
          .run();

        const row = await env.DB.prepare(
          `SELECT id, owner_id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects WHERE id = ?`,
        )
          .bind(id)
          .first();

        const res = json({ project: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = json({ error: msg }, 400);
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

        const res = json({
          projects: results ?? [],
        });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = json({ error: msg }, 500);
        return withCors(request, env, res);
      }
    }

    if (request.method === "GET" && url.pathname === "/v1/my/projects") {
      const claimsOrRes = await readClaims(request, env);
      if (claimsOrRes instanceof Response) {
        return withCors(request, env, claimsOrRes);
      }
      try {
        const { results } = await env.DB.prepare(
          `SELECT id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects
           WHERE owner_id = ?
           ORDER BY created_at DESC`,
        )
          .bind(claimsOrRes.sub)
          .all();

        const res = json({ projects: results ?? [] });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = json({ error: msg }, 500);
        return withCors(request, env, res);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/projects") {
      const claimsOrRes = await readClaims(request, env);
      if (claimsOrRes instanceof Response) {
        return withCors(request, env, claimsOrRes);
      }
      if (claimsOrRes.role !== "entrepreneur_farang" && claimsOrRes.role !== "admin") {
        const res = json({ error: "Only entrepreneurs can create projects" }, 403);
        return withCors(request, env, res);
      }
      try {
        const body = (await request.json()) as Record<string, unknown>;
        const title_en = String(body.title_en ?? "").trim().slice(0, 500);
        const title_th = String(body.title_th ?? "").trim().slice(0, 500);
        const description_en = String(body.description_en ?? "").trim().slice(0, 20000);
        const description_th = String(body.description_th ?? "").trim().slice(0, 20000);
        const industry = String(body.industry ?? "").trim().slice(0, 200);
        if (!title_en || !title_th || !description_en || !description_th || !industry) {
          const res = json({ error: "Missing required fields" }, 400);
          return withCors(request, env, res);
        }

        const location =
          typeof body.location === "string"
            ? body.location.trim().slice(0, 200) || "Bangkok"
            : "Bangkok";
        const required_investment =
          typeof body.required_investment === "number" ? body.required_investment : null;
        const equity_offered =
          typeof body.equity_offered === "number" ? body.equity_offered : 51;

        const id = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO projects (
            id, owner_id, title_en, title_th, description_en, description_th,
            industry, location, required_investment, equity_offered, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
        )
          .bind(
            id,
            claimsOrRes.sub,
            title_en,
            title_th,
            description_en,
            description_th,
            industry,
            location,
            required_investment,
            equity_offered,
          )
          .run();

        const row = await env.DB.prepare(
          `SELECT id, owner_id, title_en, title_th, description_en, description_th,
                  industry, location, required_investment, equity_offered, status, created_at
           FROM projects WHERE id = ?`,
        )
          .bind(id)
          .first();

        const res = json({ project: row }, 201);
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = json({ error: msg }, 400);
        return withCors(request, env, res);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/auth/register") {
      try {
        const body = (await request.json()) as {
          email?: string;
          password?: string;
          full_name?: string;
          nationality?: string;
        };
        const email = String(body.email ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");
        const full_name = String(body.full_name ?? "").trim().slice(0, 200);
        const nationality = String(body.nationality ?? "").trim().slice(0, 100);

        if (!email || !EMAIL_RE.test(email)) {
          const res = json({ error: "Invalid email" }, 400);
          return withCors(request, env, res);
        }
        if (password.length < 10) {
          const res = json(
            { error: "Password must be at least 10 characters" },
            400,
          );
          return withCors(request, env, res);
        }
        if (!full_name || !nationality) {
          const res = json({ error: "Missing name or nationality" }, 400);
          return withCors(request, env, res);
        }

        const dup = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`)
          .bind(email)
          .first();
        if (dup) {
          const res = json({ error: "Email already registered" }, 409);
          return withCors(request, env, res);
        }

        const id = crypto.randomUUID();
        const password_hash = await hashPassword(password);
        const role = "entrepreneur_farang";

        await env.DB.prepare(
          `INSERT INTO users (id, email, password_hash, role, full_name, nationality, is_verified)
           VALUES (?, ?, ?, ?, ?, ?, 0)`,
        )
          .bind(id, email, password_hash, role, full_name, nationality)
          .run();

        let token: string;
        try {
          token = await signUserJwt(env, {
            sub: id,
            email,
            role,
          });
        } catch (e) {
          if (e instanceof Error && e.message.includes("JWT_SECRET")) {
            return withCors(request, env, jwtErrorResponse());
          }
          throw e;
        }

        const row = await env.DB.prepare(
          `SELECT id, email, role, full_name, nationality, is_verified, created_at FROM users WHERE id = ?`,
        )
          .bind(id)
          .first();

        const res = json({ token, user: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = json({ error: msg }, 400);
        return withCors(request, env, res);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/auth/login") {
      try {
        const body = (await request.json()) as {
          email?: string;
          password?: string;
        };
        const email = String(body.email ?? "").trim().toLowerCase();
        const password = String(body.password ?? "");

        if (!email || !EMAIL_RE.test(email)) {
          const res = json({ error: "Invalid email" }, 400);
          return withCors(request, env, res);
        }

        try {
          const row = await env.DB.prepare(
            `SELECT id, email, password_hash, role, full_name, nationality, is_verified, created_at FROM users WHERE email = ?`,
          )
            .bind(email)
            .first<{
              id: string;
              email: string;
              password_hash: string;
              role: string;
              full_name: string;
              nationality: string;
              is_verified: number;
              created_at: string;
            }>();

          if (!row) {
            const res = json({ error: "Invalid credentials" }, 401);
            return withCors(request, env, res);
          }

          const ok = await verifyPassword(password, row.password_hash);
          if (!ok) {
            const res = json({ error: "Invalid credentials" }, 401);
            return withCors(request, env, res);
          }

          let token: string;
          try {
            token = await signUserJwt(env, {
              sub: row.id,
              email: row.email,
              role: row.role,
            });
          } catch (e) {
            if (e instanceof Error && e.message.includes("JWT_SECRET")) {
              return withCors(request, env, jwtErrorResponse());
            }
            throw e;
          }

          const user = {
            id: row.id,
            email: row.email,
            role: row.role,
            full_name: row.full_name,
            nationality: row.nationality,
            is_verified: row.is_verified,
            created_at: row.created_at,
          };

          const res = json({ token, user });
          return withCors(request, env, res);
        } catch (e) {
          if (e instanceof Error && e.message.includes("JWT_SECRET")) {
            return withCors(request, env, jwtErrorResponse());
          }
          throw e;
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = json({ error: msg }, 400);
        return withCors(request, env, res);
      }
    }

    if (request.method === "GET" && url.pathname === "/v1/auth/me") {
      const claimsOrRes = await readClaims(request, env);
      if (claimsOrRes instanceof Response) {
        return withCors(request, env, claimsOrRes);
      }
      try {
        const row = await env.DB.prepare(
          `SELECT id, email, role, full_name, nationality, is_verified, created_at FROM users WHERE id = ?`,
        )
          .bind(claimsOrRes.sub)
          .first();

        if (!row) {
          const res = json({ error: "Not found" }, 404);
          return withCors(request, env, res);
        }

        const res = json({ user: row });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Database error";
        const res = json({ error: msg }, 500);
        return withCors(request, env, res);
      }
    }

    if (request.method === "POST" && url.pathname === "/v1/leads") {
      const ipGate = await gateLeadIp(env, request);
      if (ipGate) return withCors(request, env, ipGate);

      try {
        const body = (await request.json()) as {
          email?: string;
          role?: string;
          locale?: string;
          message?: string;
          project_id?: string | null;
          website?: string;
        };

        if (
          typeof body.website === "string" &&
          body.website.trim().length > 0
        ) {
          const fakeId = crypto.randomUUID();
          const res = json({ ok: true, id: fakeId }, 201);
          return withCors(request, env, res);
        }

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
          const res = json({ error: "Invalid email" }, 400);
          return withCors(request, env, res);
        }

        const emailGate = await gateLeadEmail(env, email);
        if (emailGate) return withCors(request, env, emailGate);

        if (
          role !== "investor_thai" &&
          role !== "entrepreneur_farang"
        ) {
          const res = json({ error: "Invalid role" }, 400);
          return withCors(request, env, res);
        }

        if (projectId) {
          const exists = await env.DB.prepare(
            `SELECT id FROM projects WHERE id = ? AND status = 'published'`,
          )
            .bind(projectId)
            .first();
          if (!exists) {
            const res = json(
              { error: "Unknown or unpublished project" },
              400,
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

        const res = json({ ok: true, id }, { status: 201 });
        return withCors(request, env, res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Bad request";
        const res = json({ error: msg }, 400);
        return withCors(request, env, res);
      }
    }

    const plain = new Response(
      "Thai-Farang API — auth: POST /v1/auth/register, /v1/auth/login, GET /v1/auth/me — projects: GET /v1/projects, /v1/projects/:id — manage: GET/PATCH /v1/manage/projects/:id, GET /v1/my/projects, POST /v1/projects — POST /v1/leads",
      {
        headers: { "content-type": "text/plain;charset=UTF-8" },
      },
    );
    return withCors(request, env, plain);
  },
};

export default worker;
