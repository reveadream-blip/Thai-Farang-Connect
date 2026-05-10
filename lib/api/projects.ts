import type { ApiProject } from "@/lib/api/types";
import { publicApiUrl } from "@/lib/env/public";

export async function fetchPublishedProjects(): Promise<ApiProject[]> {
  const base = publicApiUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/v1/projects`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { projects?: ApiProject[] };
    return Array.isArray(data.projects) ? data.projects : [];
  } catch {
    return [];
  }
}
