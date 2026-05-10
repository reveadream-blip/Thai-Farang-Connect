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
        className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
      >
        {t("projectsPage.backToList")}
      </Link>
    </p>
  );
}
