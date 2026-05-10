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
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight text-teal-700 dark:text-teal-400"
        >
          Thai-Farang-Connect
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700 dark:text-stone-300">
          <Link className="hover:text-teal-600" href={`/${locale}/investors`}>
            {t("nav.investors")}
          </Link>
          <Link className="hover:text-teal-600" href={`/${locale}/projects`}>
            {t("nav.projects")}
          </Link>
          <Link className="hover:text-teal-600" href={`/${locale}/legal`}>
            {t("nav.legal")}
          </Link>
          <Link className="hover:text-teal-600" href={`/${locale}/admin/login`}>
            {t("nav.studio")}
          </Link>
          <div className="flex items-center gap-1 border-l border-stone-300 pl-4 dark:border-stone-600">
            <Globe className="size-4 text-stone-500" aria-hidden />
            {locales.map(({ code, label }) => (
              <Link
                key={code}
                href={`/${code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={
                  code === locale
                    ? "rounded bg-teal-100 px-2 py-0.5 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200"
                    : "rounded px-2 py-0.5 hover:bg-stone-100 dark:hover:bg-stone-800"
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
