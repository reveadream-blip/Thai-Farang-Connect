"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const locales = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "th", label: "TH" },
] as const;

type Props = {
  locale: string;
};

export function SiteHeader({ locale }: Props) {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const pathWithoutLocale =
    pathname.replace(/^\/(en|fr|th)(?=\/|$)/, "") || "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link
          href={`/${locale}`}
          className="font-hero-title text-base font-semibold tracking-tight text-premium-gold md:text-lg"
        >
          Thai-Farang-Connect
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300 md:gap-4">
          <Link
            className="rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-premium-gold"
            href={`/${locale}/investors`}
          >
            {t("nav.investors")}
          </Link>
          <Link
            className="rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-premium-gold"
            href={`/${locale}/projects`}
          >
            {t("nav.projects")}
          </Link>
          <Link
            className="rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-premium-gold"
            href={`/${locale}/legal`}
          >
            {t("nav.legal")}
          </Link>
          <Link
            className="rounded-lg px-2 py-1 transition hover:bg-white/5 hover:text-premium-gold"
            href={`/${locale}/admin/login`}
          >
            {t("nav.studio")}
          </Link>
          <div className="flex items-center gap-1 border-l border-white/15 pl-3 md:pl-4">
            <Globe className="size-4 text-slate-500" aria-hidden />
            {locales.map(({ code, label }) => (
              <Link
                key={code}
                href={`/${code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={
                  code === locale
                    ? "rounded-md bg-premium-gold/15 px-2 py-1 text-xs font-semibold text-premium-gold"
                    : "rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }
                hrefLang={code}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
