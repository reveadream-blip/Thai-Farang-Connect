import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchPublishedProjectById } from "@/lib/api/projects";
import { LeadForm } from "@/components/leads/LeadForm";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await fetchPublishedProjectById(id);
  if (!project) return { title: "Project" };
  const title =
    locale === "th" ? project.title_th : project.title_en;
  return {
    title,
    description:
      locale === "th" ? project.description_th.slice(0, 160) : project.description_en.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const project = await fetchPublishedProjectById(id);
  if (!project) notFound();

  return (
    <>
      <ProjectDetailView project={project} locale={locale} />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <LeadForm locale={locale} projectId={project.id} />
      </div>
    </>
  );
}
