import type { Metadata } from "next";

import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { fetchPublishedProjects } from "@/lib/api/projects";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.projectsPage.title,
    description: c.projectsPage.lead,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchPublishedProjects();

  return <ProjectsPageClient locale={locale} projects={projects} />;
}
