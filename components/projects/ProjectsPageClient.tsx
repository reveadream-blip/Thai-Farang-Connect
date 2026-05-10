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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-14">
      <header className="max-w-3xl">
        <h1 className="font-hero-title text-3xl font-bold text-slate-50 md:text-4xl">
          {t("projectsPage.title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          {t("projectsPage.lead")}
        </p>
        {projects.length > 0 && (
          <p className="mt-3 text-sm font-medium text-premium-gold">
            {t("projectsPage.count", { count: projects.length })}
          </p>
        )}
      </header>

      {projects.length === 0 ? (
        <div className="glass-card rounded-2xl border-dashed border-premium-gold/20 p-12 text-center">
          <p className="font-hero-title text-lg font-semibold text-slate-100">
            {t("projectsPage.emptyTitle")}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
            {t("projectsPage.emptyBody")}
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
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
