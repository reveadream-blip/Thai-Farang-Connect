import { cookies } from "next/headers";

import { publicApiUrl } from "@/lib/env/public";

/** Appels authentifiés au Worker API (cookie httpOnly `tf_token`). */
export async function workerAuthedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const jar = await cookies();
  const token = jar.get("tf_token")?.value;
  const base = publicApiUrl.replace(/\/$/, "");
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}
