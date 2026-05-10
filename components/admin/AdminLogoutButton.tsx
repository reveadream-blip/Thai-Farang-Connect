"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = { locale: string };

export function AdminLogoutButton({ locale }: Props) {
  const { t } = useTranslation("common");
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-600"
    >
      {t("adminPage.logout")}
    </button>
  );
}
