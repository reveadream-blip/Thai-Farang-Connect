import { headers } from "next/headers";
import { Inter, Montserrat } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700"],
});

function directionForLocale(locale: string): "ltr" | "rtl" {
  const rtl = new Set(["ar", "he", "fa", "ur"]);
  const short = locale.split("-")[0];
  return rtl.has(short) ? "rtl" : "ltr";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") ?? "en";

  return (
    <html
      lang={locale}
      dir={directionForLocale(locale)}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${montserrat.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased`}
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
