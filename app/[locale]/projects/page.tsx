import type { Metadata } from "next";

import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";
import { fetchPublishedProjects } from "@/lib/api/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await fetchPublishedProjects();

  return <ProjectsPageClient locale={locale} projects={projects} />;
}
