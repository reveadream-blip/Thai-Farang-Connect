"use client";

import { useTranslation } from "react-i18next";
import { BadgePercent, Scale, Shield } from "lucide-react";

export function TrustBar() {
  const { t } = useTranslation("common");

  const items = [
    { icon: BadgePercent, key: "majority" as const },
    { icon: Scale, key: "legal" as const },
    { icon: Shield, key: "verified" as const },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="glass-card rounded-2xl px-6 py-8 md:px-10 md:py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-premium-gold">
          {t("trust.barEyebrow")}
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-4">
          {items.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-4 md:text-left"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-premium-gold/20 bg-premium-blue/40 text-premium-gold">
                <Icon className="size-7" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="mt-4 md:mt-0">
                <h3 className="font-hero-title text-sm font-semibold text-slate-100">
                  {t(`trust.bar.${key}.title`)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {t(`trust.bar.${key}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
