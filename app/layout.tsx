import { headers } from "next/headers";
import "./globals.css";

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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
