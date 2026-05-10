"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = {
  locale: string;
};

export function Hero({ locale }: Props) {
  const { t } = useTranslation("common");

  return (
    <section className="relative overflow-hidden gradient-mesh px-4 pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-premium-gold/25 bg-slate-950/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-premium-gold">
          <Sparkles className="size-3.5" aria-hidden />
          {t("hero.brandBadge")}
        </p>

        <h1 className="font-hero-title text-balance text-4xl font-bold leading-[1.08] tracking-tight gradient-text-hero md:text-6xl md:leading-[1.05] lg:text-7xl">
          {t("hero.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href={`/${locale}/investors`}
            className="btn-premium-primary inline-flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-slate-950 transition duration-300"
          >
            {t("hero.ctaInvest")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={`/${locale}/admin/register`}
            className="btn-premium-secondary inline-flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition duration-300"
          >
            {t("hero.ctaPropose")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
