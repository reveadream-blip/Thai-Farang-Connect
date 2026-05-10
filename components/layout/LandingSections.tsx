"use client";

import { useTranslation } from "react-i18next";
import { Briefcase, Landmark, ShieldCheck } from "lucide-react";

export function LandingSections() {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-16 pb-16 pt-12">
      <section className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
          {t("hero.subtitle")}
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
        <article className="rounded-2xl border border-teal-200 bg-teal-50/80 p-8 shadow-sm dark:border-teal-900 dark:bg-teal-950/40">
          <div className="mb-4 flex items-center gap-2 text-teal-800 dark:text-teal-300">
            <Landmark className="size-8" aria-hidden />
            <h2 className="text-xl font-semibold">{t("sectionInvestors.title")}</h2>
          </div>
          <p className="leading-relaxed text-stone-700 dark:text-stone-300">
            {t("sectionInvestors.body")}
          </p>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <div className="mb-4 flex items-center gap-2 text-stone-800 dark:text-stone-200">
            <Briefcase className="size-8" aria-hidden />
            <h2 className="text-xl font-semibold">{t("sectionEntrepreneurs.title")}</h2>
          </div>
          <p className="leading-relaxed text-stone-700 dark:text-stone-300">
            {t("sectionEntrepreneurs.body")}
          </p>
        </article>
      </section>

      <section className="mx-auto max-w-5xl rounded-2xl border border-stone-200 bg-stone-50 px-6 py-10 dark:border-stone-800 dark:bg-stone-900/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
          <ShieldCheck
            className="mx-auto size-12 shrink-0 text-teal-600 dark:text-teal-400 md:mx-0"
            aria-hidden
          />
          <div>
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {t("trust.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-400">
              {t("trust.body")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
