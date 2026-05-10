"use client";

import { useTranslation } from "react-i18next";
import { Briefcase, Landmark } from "lucide-react";

import type { ApiProject } from "@/lib/api/types";
import { Hero } from "@/components/layout/Hero";
import { LandingProjectFeed } from "@/components/layout/LandingProjectFeed";
import { TrustBar } from "@/components/layout/TrustBar";

type Props = {
  locale: string;
  projects: ApiProject[];
};

export function LandingSections({ locale, projects }: Props) {
  const { t } = useTranslation("common");

  return (
    <div className="pb-16">
      <Hero locale={locale} />
      <TrustBar />

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-2 md:gap-8">
        <article className="glass-card glass-card-hover rounded-2xl p-8 md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl border border-premium-gold/25 bg-premium-blue/50 text-premium-gold">
              <Landmark className="size-6" aria-hidden />
            </span>
            <h2 className="font-hero-title text-xl font-semibold text-slate-50">
              {t("sectionInvestors.title")}
            </h2>
          </div>
          <p className="leading-relaxed text-slate-400">{t("sectionInvestors.body")}</p>
        </article>

        <article className="glass-card glass-card-hover rounded-2xl p-8 md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl border border-premium-gold/25 bg-premium-blue/50 text-premium-gold">
              <Briefcase className="size-6" aria-hidden />
            </span>
            <h2 className="font-hero-title text-xl font-semibold text-slate-50">
              {t("sectionEntrepreneurs.title")}
            </h2>
          </div>
          <p className="leading-relaxed text-slate-400">{t("sectionEntrepreneurs.body")}</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="glass-card rounded-2xl border-premium-gold/15 p-8 md:p-10">
          <h2 className="font-hero-title text-xl font-semibold text-slate-50 md:text-2xl">
            {t("trust.title")}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">{t("trust.body")}</p>
        </div>
      </section>

      <LandingProjectFeed locale={locale} projects={projects} />
    </div>
  );
}
