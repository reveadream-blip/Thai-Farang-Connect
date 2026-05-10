"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = {
  locale: string;
};

export function BackToProjectsLink({ locale }: Props) {
  const { t } = useTranslation("common");

  return (
    <p>
      <Link
        href={`/${locale}/projects`}
        className="text-sm font-semibold text-premium-gold transition hover:text-premium-gold-light"
      >
        {t("projectsPage.backToList")}
      </Link>
    </p>
  );
}
