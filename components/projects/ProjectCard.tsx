"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";

import type { ApiProject } from "@/lib/api/types";
import {
  pickProjectDescription,
  pickProjectTitle,
} from "@/lib/i18n/projectLocale";

type Props = {
  project: ApiProject;
  locale: string;
  /** Grille landing : carte compacte glass + hover. */
  variant?: "default" | "landing";
};

function formatThb(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProjectCard({ project, locale, variant = "default" }: Props) {
  const { t } = useTranslation("common");
  const isLanding = variant === "landing";

  return (
    <article
      className={`glass-card glass-card-hover group rounded-2xl p-6 ${isLanding ? "h-full" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="text-xl leading-none" title="Thailand">
            🇹🇭
          </span>
          <span className="text-xl leading-none opacity-90" title="International">
            🌐
          </span>
        </div>
        <span className="rounded-full border border-premium-gold/25 bg-premium-blue/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-premium-gold">
          {project.industry}
        </span>
      </div>

      <div className="mt-4">
        <h2 className="font-hero-title text-lg font-semibold leading-snug text-slate-50 group-hover:text-premium-gold-light md:text-xl">
          {pickProjectTitle(project, locale)}
        </h2>
        <p
          className={`mt-2 text-sm leading-relaxed text-slate-400 ${isLanding ? "line-clamp-2" : ""}`}
        >
          {pickProjectDescription(project, locale)}
        </p>
      </div>

      <dl className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            {t("projectsPage.cardLocation")}
          </dt>
          <dd className="mt-1 font-medium">{project.location}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
            <TrendingUp className="size-3 text-premium-gold" aria-hidden />
            {t("projectsPage.cardRaise")}
          </dt>
          <dd className="mt-1 font-semibold text-premium-gold-light tabular-nums">
            {formatThb(project.required_investment)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">
            {t("projectsPage.cardEquity")}
          </dt>
          <dd className="mt-1 font-medium">{project.equity_offered ?? 51}%</dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-white/10 pt-4">
        <Link
          href={`/${locale}/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-premium-gold transition hover:text-premium-gold-light"
        >
          {t("projectsPage.viewDetail")}
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </p>
    </article>
  );
}
