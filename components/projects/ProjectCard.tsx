"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { ApiProject } from "@/lib/api/types";

type Props = {
  project: ApiProject;
  locale: string;
};

function pickTitle(p: ApiProject, locale: string) {
  if (locale === "th") return p.title_th;
  return p.title_en;
}

function pickDescription(p: ApiProject, locale: string) {
  if (locale === "th") return p.description_th;
  return p.description_en;
}

function formatThb(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProjectCard({ project, locale }: Props) {
  const { t } = useTranslation("common");

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          {pickTitle(project, locale)}
        </h2>
        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-900 dark:bg-teal-900/50 dark:text-teal-200">
          {project.industry}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {pickDescription(project, locale)}
      </p>
      <dl className="mt-4 grid gap-2 text-sm text-stone-700 dark:text-stone-300 sm:grid-cols-3">
        <div>
          <dt className="text-stone-500 dark:text-stone-500">
            {t("projectsPage.cardLocation")}
          </dt>
          <dd>{project.location}</dd>
        </div>
        <div>
          <dt className="text-stone-500 dark:text-stone-500">
            {t("projectsPage.cardRaise")}
          </dt>
          <dd>{formatThb(project.required_investment)}</dd>
        </div>
        <div>
          <dt className="text-stone-500 dark:text-stone-500">
            {t("projectsPage.cardEquity")}
          </dt>
          <dd>{project.equity_offered ?? 51}%</dd>
        </div>
      </dl>

      <p className="mt-4">
        <Link
          href={`/${locale}/projects/${project.id}`}
          className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
        >
          {t("projectsPage.viewDetail")}
        </Link>
      </p>
    </article>
  );
}
