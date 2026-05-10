import type { Metadata } from "next";

import { AdminRegisterForm } from "@/components/admin/AdminRegisterForm";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.adminPage.registerTitle,
    description: c.adminPage.registerHint,
  };
}

export default async function AdminRegisterPage({
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
          {c.adminPage.registerTitle}
        </h1>
      </header>
      <AdminRegisterForm locale={locale} />
      <p className="mx-auto mt-6 max-w-md text-center text-sm">
        <a
          href={`/${locale}/admin/login`}
          className="text-teal-700 underline dark:text-teal-400"
        >
          {c.adminPage.loginLink}
        </a>
      </p>
    </div>
  );
}
