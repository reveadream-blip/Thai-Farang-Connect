import Link from "next/link";

type Props = {
  locale: string;
};

export function SiteFooter({ locale }: Props) {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 py-10 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-slate-400">
          © {new Date().getFullYear()} Thai-Farang-Connect · Bangkok, Thailand
        </p>
        <div className="flex flex-wrap gap-6">
          <Link
            href={`/${locale}/legal`}
            className="transition hover:text-premium-gold"
          >
            Compliance & legal
          </Link>
          <Link
            href={`/${locale}/projects`}
            className="transition hover:text-premium-gold"
          >
            Business plans
          </Link>
        </div>
      </div>
    </footer>
  );
}
