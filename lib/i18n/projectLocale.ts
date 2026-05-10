import type { ApiProject } from "@/lib/api/types";

/** Titres et descriptions API sont en anglais et thaï ; le français réutilise l’anglais. */
export function pickProjectTitle(project: ApiProject, locale: string): string {
  if (locale === "th") return project.title_th;
  return project.title_en;
}

export function pickProjectDescription(
  project: ApiProject,
  locale: string,
): string {
  if (locale === "th") return project.description_th;
  return project.description_en;
}
