import Link from "next/link";

type Props = {
  locale: string;
};

export function SiteFooter({ locale }: Props) {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-8 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Thai-Farang-Connect · Bangkok, Thailand</p>
        <div className="flex gap-6">
          <Link href={`/${locale}/legal`}>Compliance & legal</Link>
          <Link href={`/${locale}/projects`}>Business plans</Link>
        </div>
      </div>
    </footer>
  );
}
