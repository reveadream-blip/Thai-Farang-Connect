import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import type { ApiProject } from "@/lib/api/types";
import { commonForLocale } from "@/lib/i18n/commonBundle";
import { workerAuthedFetch } from "@/lib/server/workerAuthFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.adminPage.projectsTitle,
    description: c.adminPage.projectsLead,
  };
}

export default async function AdminProjectsDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = commonForLocale(locale);

  const res = await workerAuthedFetch("/v1/my/projects");
  if (res.status === 401) {
    redirect(`/${locale}/admin/login`);
  }
  if (!res.ok) {
    return (
      <div className="px-4 py-12">
        <p className="text-red-600">{c.adminPage.errorGeneric}</p>
      </div>
    );
  }

  const data = (await res.json()) as { projects?: ApiProject[] };
  const projects = data.projects ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
            {c.adminPage.projectsTitle}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {c.adminPage.projectsLead}
          </p>
        </header>
        <div className="flex flex-wrap gap-2">
          <AdminLogoutButton locale={locale} />
          <Link
            href={`/${locale}/admin/projects/new`}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            {c.adminPage.newProject}
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-stone-600 dark:text-stone-400">
          {c.adminPage.noProjects}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/${locale}/admin/projects/${encodeURIComponent(p.id)}/edit`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm hover:border-teal-300 dark:border-stone-700 dark:bg-stone-900"
              >
                <span className="font-medium text-stone-900 dark:text-stone-50">
                  {p.title_en}
                </span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {p.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
