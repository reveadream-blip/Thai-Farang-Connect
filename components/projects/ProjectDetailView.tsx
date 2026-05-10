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
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-14">
      <BackToProjectsLink locale={locale} />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-hero-title text-3xl font-bold text-slate-50 md:text-4xl">
            {pickProjectTitle(project, locale)}
          </h1>
          <p className="mt-3 text-slate-400">
            {project.industry} · {project.location}
          </p>
        </div>
        <span className="rounded-full border border-premium-gold/30 bg-premium-blue/50 px-4 py-1.5 text-sm font-semibold text-premium-gold">
          {statusLabel}
        </span>
      </header>

      <section className="glass-card rounded-2xl p-8">
        <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
          {pickProjectDescription(project, locale)}
        </p>
      </section>

      <ProjectDetailStats project={project} locale={locale} />
    </div>
  );
}
