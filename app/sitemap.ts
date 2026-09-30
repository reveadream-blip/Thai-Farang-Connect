import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/env/public";

const locales = ["en", "fr", "th"] as const;
const publicRoutes = ["", "/investors", "/legal", "/projects"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${publicSiteUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
