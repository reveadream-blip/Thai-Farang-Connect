import type { ApiProject } from "@/lib/api/types";
import { apiFetch } from "@/lib/server/apiFetch";

export async function fetchPublishedProjects(): Promise<ApiProject[]> {
  try {
    const res = await apiFetch("/v1/projects", {
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

export async function fetchPublishedProjectById(
  id: string,
): Promise<ApiProject | null> {
  const safeId = encodeURIComponent(id);
  try {
    const res = await apiFetch(`/v1/projects/${safeId}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as { project?: ApiProject };
    return data.project ?? null;
  } catch {
    return null;
  }
}
