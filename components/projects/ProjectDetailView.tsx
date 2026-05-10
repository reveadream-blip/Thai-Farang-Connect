import type { ApiProject } from "@/lib/api/types";
import {
  pickProjectDescription,
  pickProjectTitle,
} from "@/lib/i18n/projectLocale";

import { BackToProjectsLink } from "@/components/projects/BackToProjectsLink";
import { ProjectDetailStats } from "@/components/projects/ProjectDetailStats";

type Props = {
  project: ApiProject;
  locale: string;
  statusLabel: string;
};

export function ProjectDetailView({
  project,
  locale,
  statusLabel,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <BackToProjectsLink locale={locale} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
            {pickProjectTitle(project, locale)}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {project.industry} · {project.location}
          </p>
        </div>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-900 dark:bg-teal-900/50 dark:text-teal-200">
          {statusLabel}
        </span>
      </header>

      <section className="prose prose-stone max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap leading-relaxed">
          {pickProjectDescription(project, locale)}
        </p>
      </section>

      <ProjectDetailStats project={project} locale={locale} />
    </div>
  );
}
