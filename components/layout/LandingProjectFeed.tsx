"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { ApiProject } from "@/lib/api/types";
import { ProjectCard } from "@/components/projects/ProjectCard";

type Props = {
  locale: string;
  projects: ApiProject[];
};

export function LandingProjectFeed({ locale, projects }: Props) {
  const { t } = useTranslation("common");

  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-hero-title text-2xl font-bold text-slate-50 md:text-3xl">
            {t("landing.feedTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-slate-400">{t("landing.feedLead")}</p>
        </div>
        <Link
          href={`/${locale}/projects`}
          className="text-sm font-semibold text-premium-gold transition hover:text-premium-gold-light"
        >
          {t("landing.viewAll")} →
        </Link>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.id}>
            <ProjectCard project={p} locale={locale} variant="landing" />
          </li>
        ))}
      </ul>
    </section>
  );
}
