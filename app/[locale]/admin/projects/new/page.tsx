import type { Metadata } from "next";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.adminPage.newProject,
    description: c.adminPage.projectsLead,
  };
}

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = commonForLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {c.adminPage.newProject}
        </h1>
      </header>
      <ProjectForm locale={locale} mode="create" />
    </div>
  );
}
