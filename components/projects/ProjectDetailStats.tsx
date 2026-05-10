"use client";

import { useTranslation } from "react-i18next";

import type { ApiProject } from "@/lib/api/types";

type Props = {
  project: ApiProject;
  locale: string;
};

function formatThb(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProjectDetailStats({ project, locale }: Props) {
  const { t } = useTranslation("common");

  const listed =
    project.created_at != null
      ? new Date(project.created_at).toLocaleDateString(
          locale === "th" ? "th-TH" : locale === "fr" ? "fr-FR" : "en-GB",
        )
      : "—";

  return (
    <dl className="glass-card grid gap-4 rounded-2xl p-6 sm:grid-cols-3">
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-500">
          {t("projectsPage.cardRaise")}
        </dt>
        <dd className="mt-1 font-hero-title text-lg font-semibold text-premium-gold-light tabular-nums">
          {formatThb(project.required_investment)}
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-500">
          {t("projectsPage.cardEquity")}
        </dt>
        <dd className="mt-1 font-semibold text-slate-100">{project.equity_offered ?? 51}%</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-500">
          {t("projectsPage.cardListed")}
        </dt>
        <dd className="mt-1 font-medium text-slate-200">{listed}</dd>
      </div>
    </dl>
  );
}
