"use client";

import { useTranslation } from "react-i18next";

import type { ApiProject } from "@/lib/api/types";
import { ProjectCard } from "@/components/projects/ProjectCard";

type Props = {
  locale: string;
  projects: ApiProject[];
};

export function ProjectsPageClient({ locale, projects }: Props) {
  const { t } = useTranslation("common");

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t("projectsPage.title")}
        </h1>
        <p className="mt-3 text-lg text-stone-600 dark:text-stone-400">
          {t("projectsPage.lead")}
        </p>
        {projects.length > 0 && (
          <p className="mt-2 text-sm text-stone-500">
            {t("projectsPage.count", { count: projects.length })}
          </p>
        )}
      </header>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center dark:border-stone-600 dark:bg-stone-900/40">
          <p className="font-medium text-stone-800 dark:text-stone-200">
            {t("projectsPage.emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            {t("projectsPage.emptyBody")}
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
