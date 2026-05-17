import { getCloudflareContext } from "@opennextjs/cloudflare";

import { publicApiUrl } from "@/lib/env/public";

type Fetcher = { fetch: typeof fetch };

/** Appels au Worker API — service binding en prod (évite l’erreur 1042 workers.dev). */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const base = publicApiUrl.replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const { env } = await getCloudflareContext({ async: true });
    const api = (env as { THAI_FARANG_API?: Fetcher }).THAI_FARANG_API;
    if (api?.fetch) {
      return api.fetch(new Request(url, init));
    }
  } catch {
    // Dev local Next (hors Worker) : fetch public classique
  }

  return fetch(url, init);
}
