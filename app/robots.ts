import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/env/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${publicSiteUrl}/sitemap.xml`,
  };
}
