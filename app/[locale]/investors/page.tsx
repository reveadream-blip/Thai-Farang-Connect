import type { Metadata } from "next";

import { InvestorsContent } from "@/components/investors/InvestorsContent";

export const metadata: Metadata = {
  title: "Investors",
};

export default async function InvestorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <InvestorsContent locale={locale} />;
}
