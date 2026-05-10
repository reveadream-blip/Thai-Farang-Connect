import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr", "th"] as const;
type Locale = (typeof locales)[number];

function isLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s);
}

function negotiateLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("i18next")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  if (lower.includes("th")) return "th";
  if (lower.includes("fr")) return "fr";
  return "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (!first || !isLocale(first)) {
    const locale = negotiateLocale(request);
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/"
        ? `/${locale}`
        : `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    const res = NextResponse.redirect(url);
    res.cookies.set("i18next", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const locale = first;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  res.cookies.set("i18next", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|locales).*)"],
};
