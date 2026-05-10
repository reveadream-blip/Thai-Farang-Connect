/**
 * Server-side D1 access belongs in the Cloudflare Worker (`src/index.ts`).
 * From Next.js, call your Worker HTTPS endpoints — never expose raw D1 credentials in the browser.
 */

export type UserRole = "investor_thai" | "entrepreneur_farang" | "admin";
