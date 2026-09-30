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
      locale === "fr"
        ? "Investir en Thaïlande | Farang-Thai Connect"
        : locale === "th"
          ? "ลงทุนในไทย | Farang-Thai Connect"
          : "Invest in Thailand | Farang-Thai Connect",
    description:
      locale === "fr"
        ? "Plateforme de mise en relation pour investisseurs thaïlandais et entrepreneurs étrangers. Cadre clair, business plans viables."
        : "Legal matching platform for Thai investors (51%) and foreign entrepreneurs. Clear framework and viable business plans.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-US": `${baseUrl}/en`,
        "th-TH": `${baseUrl}/th`,
        "fr-FR": `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      url: `${baseUrl}/${locale}`,
      siteName: "Farang-Thai Connect",
      title:
        locale === "fr"
          ? "Investir en Thaïlande | Farang-Thai Connect"
          : "Invest in Thailand | Farang-Thai Connect",
      description:
        locale === "fr"
          ? "Mise en relation investisseurs thaïlandais et entrepreneurs étrangers."
          : "Match Thai investors with foreign entrepreneurs.",
      locale: locale === "fr" ? "fr_FR" : locale === "th" ? "th_TH" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "fr"
          ? "Investir en Thaïlande | Farang-Thai Connect"
          : "Invest in Thailand | Farang-Thai Connect",
      description:
        locale === "fr"
          ? "Mise en relation investisseurs thaïlandais et entrepreneurs étrangers."
          : "Match Thai investors with foreign entrepreneurs.",
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
