/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS?: string;
  /** Min. 32 caractères — secret Wrangler : `wrangler secret put JWT_SECRET` */
  JWT_SECRET?: string;
}
