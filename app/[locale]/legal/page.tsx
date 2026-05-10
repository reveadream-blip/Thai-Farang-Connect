import type { Metadata } from "next";

import { LegalContent } from "@/components/legal/LegalContent";
import { commonForLocale } from "@/lib/i18n/commonBundle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = commonForLocale(locale);
  return {
    title: c.legalPage.title,
    description: c.legalPage.lead,
  };
}

export default function LegalPage() {
  return <LegalContent />;
}
