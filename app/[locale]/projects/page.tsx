import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
        Projects & business plans
      </h1>
      <p className="mt-4 text-stone-600 dark:text-stone-400">
        Secure handling of business plans (including R2-hosted PDFs) will connect
        to your Cloudflare Workers API.
      </p>
    </div>
  );
}
