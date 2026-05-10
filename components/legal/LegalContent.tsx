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
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-14">
      <header>
        <h1 className="font-hero-title text-3xl font-bold text-slate-50 md:text-4xl">
          {t("legalPage.title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          {t("legalPage.lead")}
        </p>
      </header>

      <ol className="relative space-y-6 border-l border-premium-gold/25 pl-6">
        {steps.map(({ icon: Icon, key }, i) => (
          <li key={key} className="relative">
            <span className="absolute -left-[29px] flex size-8 items-center justify-center rounded-full border border-premium-gold/40 bg-premium-blue font-semibold text-sm text-premium-gold">
              {i + 1}
            </span>
            <div className="glass-card rounded-xl p-5 pl-4">
              <div className="flex gap-3">
                <Icon className="mt-1 size-5 shrink-0 text-premium-gold" aria-hidden />
                <div>
                  <h2 className="font-hero-title font-semibold text-slate-100">
                    {t(`legalPage.${key}Title`)}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {t(`legalPage.${key}Body`)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-sm text-slate-500">{t("legalPage.disclaimer")}</p>
    </div>
  );
}
