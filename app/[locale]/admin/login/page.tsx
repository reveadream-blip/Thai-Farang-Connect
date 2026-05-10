import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.adminPage.loginTitle,
    description: c.adminPage.loginLead,
  };
}

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = commonForLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {c.adminPage.loginTitle}
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {c.adminPage.loginLead}
        </p>
      </header>
      <Suspense fallback={<p className="mt-8 text-sm text-stone-500">…</p>}>
        <AdminLoginForm locale={locale} />
      </Suspense>
      <p className="mx-auto mt-6 max-w-md text-center text-sm">
        <a
          href={`/${locale}/admin/register`}
          className="text-teal-700 underline dark:text-teal-400"
        >
          {c.adminPage.registerLink}
        </a>
      </p>
    </div>
  );
}
