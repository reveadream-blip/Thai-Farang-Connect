"use client";

import { useTranslation } from "react-i18next";
import { Landmark, ShieldCheck, FileCheck } from "lucide-react";

import { LeadForm } from "@/components/leads/LeadForm";

type Props = {
  locale: string;
};

export function InvestorsContent({ locale }: Props) {
  const { t } = useTranslation("common");

  const bullets = [
    { icon: Landmark, key: "b1" as const },
    { icon: ShieldCheck, key: "b2" as const },
    { icon: FileCheck, key: "b3" as const },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-14">
      <header>
        <h1 className="font-hero-title text-3xl font-bold text-slate-50 md:text-4xl">
          {t("investorsPage.title")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          {t("investorsPage.lead")}
        </p>
      </header>

      <ul className="space-y-4">
        {bullets.map(({ icon: Icon, key }) => (
          <li key={key}>
            <div className="glass-card glass-card-hover flex gap-4 rounded-2xl p-5">
              <Icon
                className="mt-0.5 size-6 shrink-0 text-premium-gold"
                aria-hidden
              />
              <p className="leading-relaxed text-slate-300">{t(`investorsPage.${key}`)}</p>
            </div>
          </li>
        ))}
      </ul>

      <LeadForm locale={locale} />
    </div>
  );
}
