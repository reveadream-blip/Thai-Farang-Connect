/** URLs publiques (variables NEXT_PUBLIC_* injectées au build Pages). */

export const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://thai-farang-connect.contact-applimanagement.workers.dev";

/** URL du Worker API (override avec NEXT_PUBLIC_API_URL sur Pages si besoin). */
export const publicApiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://thai-farang-api.contact-applimanagement.workers.dev";
