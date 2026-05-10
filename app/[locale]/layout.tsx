import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { I18nProvider } from "@/components/layout/I18nProvider";
import { publicSiteUrl } from "@/lib/env/public";

const baseUrl = publicSiteUrl;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(baseUrl),
    title:
      "Invest in Thailand | Connection Platform Farang-Thai",
    description:
      "Plateforme légale de mise en relation pour investisseurs thaïlandais (51%) et entrepreneurs étrangers. Sécurité juridique et business plans viables.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "th-TH": `${baseUrl}/th`,
        "fr-FR": `${baseUrl}/fr`,
      },
    },
    other: {
      "geo.region": "TH-10",
      "geo.placename": "Bangkok",
      "geo.position": "13.7563;100.5018",
      ICBM: "13.7563, 100.5018",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <I18nProvider locale={locale}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter locale={locale} />
      </div>
    </I18nProvider>
  );
}
