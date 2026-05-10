import type { Metadata } from "next";

import { InvestorsContent } from "@/components/investors/InvestorsContent";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.investorsPage.title,
    description: c.investorsPage.lead,
  };
}

export default async function InvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <InvestorsContent locale={locale} />;
}
