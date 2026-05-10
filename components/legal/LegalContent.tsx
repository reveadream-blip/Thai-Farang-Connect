"use client";

import { useTranslation } from "react-i18next";
import { Scale, PenLine, Users } from "lucide-react";

export function LegalContent() {
  const { t } = useTranslation("common");

  const steps = [
    { icon: Scale, key: "s1" as const },
    { icon: PenLine, key: "s2" as const },
    { icon: Users, key: "s3" as const },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t("legalPage.title")}
        </h1>
        <p className="mt-3 text-lg text-stone-600 dark:text-stone-400">
          {t("legalPage.lead")}
        </p>
      </header>

      <ol className="relative space-y-6 border-l border-stone-200 pl-6 dark:border-stone-700">
        {steps.map(({ icon: Icon, key }, i) => (
          <li key={key} className="relative">
            <span className="absolute -left-[29px] flex size-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
              {i + 1}
            </span>
            <div className="flex gap-3">
              <Icon className="mt-1 size-5 shrink-0 text-stone-500" />
              <div>
                <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                  {t(`legalPage.${key}Title`)}
                </h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {t(`legalPage.${key}Body`)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-sm text-stone-500 dark:text-stone-500">
        {t("legalPage.disclaimer")}
      </p>
    </div>
  );
}
