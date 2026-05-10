"use client";

import { useTranslation } from "react-i18next";
import { Landmark, ShieldCheck, FileCheck } from "lucide-react";

export function InvestorsContent() {
  const { t } = useTranslation("common");

  const bullets = [
    { icon: Landmark, key: "b1" as const },
    { icon: ShieldCheck, key: "b2" as const },
    { icon: FileCheck, key: "b3" as const },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t("investorsPage.title")}
        </h1>
        <p className="mt-3 text-lg text-stone-600 dark:text-stone-400">
          {t("investorsPage.lead")}
        </p>
      </header>

      <ul className="space-y-4">
        {bullets.map(({ icon: Icon, key }) => (
          <li
            key={key}
            className="flex gap-4 rounded-lg border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-900/50"
          >
            <Icon className="mt-0.5 size-6 shrink-0 text-teal-600 dark:text-teal-400" />
            <p className="text-stone-700 dark:text-stone-300">
              {t(`investorsPage.${key}`)}
            </p>
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30">
        <h2 className="font-semibold text-teal-900 dark:text-teal-200">
          {t("investorsPage.ctaTitle")}
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          {t("investorsPage.ctaBody")}
        </p>
      </section>
    </div>
  );
}
