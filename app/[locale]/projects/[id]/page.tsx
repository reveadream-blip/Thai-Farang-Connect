import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchPublishedProjectById } from "@/lib/api/projects";
import { commonForLocale } from "@/lib/i18n/commonBundle";
import {
  pickProjectDescription,
  pickProjectTitle,
} from "@/lib/i18n/projectLocale";
import { LeadForm } from "@/components/leads/LeadForm";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await fetchPublishedProjectById(id);
  if (!project) return { title: "Project" };
  const title = pickProjectTitle(project, locale);
  const desc = pickProjectDescription(project, locale).slice(0, 160);
  return {
    title,
    description: desc,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const project = await fetchPublishedProjectById(id);
  if (!project) notFound();
  const c = commonForLocale(locale);

  return (
    <>
      <ProjectDetailView
        project={project}
        locale={locale}
        statusLabel={c.projectsPage.statusPublished}
      />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <LeadForm locale={locale} projectId={project.id} />
      </div>
    </>
  );
}
