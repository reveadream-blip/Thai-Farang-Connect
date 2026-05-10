import { LandingSections } from "@/components/layout/LandingSections";
import { fetchPublishedProjects } from "@/lib/api/projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const all = await fetchPublishedProjects();
  const featured = all.slice(0, 6);

  return <LandingSections locale={locale} projects={featured} />;
}
