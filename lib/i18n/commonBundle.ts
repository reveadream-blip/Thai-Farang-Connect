import type commonEn from "../../public/locales/en/common.json";

import en from "../../public/locales/en/common.json";
import fr from "../../public/locales/fr/common.json";
import th from "../../public/locales/th/common.json";

export type CommonMessages = typeof commonEn;

const byLocale: Record<string, CommonMessages> = {
  en,
  fr,
  th,
};

/** Charge les chaînes `common.json` selon la locale de route (`en` | `fr` | `th`). */
export function commonForLocale(locale: string): CommonMessages {
  return byLocale[locale] ?? en;
}
