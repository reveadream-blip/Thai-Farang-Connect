import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import type { ApiManageProject } from "@/lib/api/types";
import { commonForLocale } from "@/lib/i18n/commonBundle";
import { workerAuthedFetch } from "@/lib/server/workerAuthFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.adminPage.editProject,
    description: c.adminPage.projectsLead,
  };
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const c = commonForLocale(locale);

  const res = await workerAuthedFetch(
    `/v1/manage/projects/${encodeURIComponent(id)}`,
  );
  if (res.status === 401) {
    redirect(`/${locale}/admin/login`);
  }
  if (res.status === 404) notFound();

  const data = (await res.json()) as { project?: ApiManageProject };
  const project = data.project;
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {c.adminPage.editProject}
        </h1>
      </header>
      <ProjectForm locale={locale} mode="edit" project={project} />
    </div>
  );
}
