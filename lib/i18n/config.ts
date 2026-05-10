"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../../public/locales/en/common.json";
import frCommon from "../../public/locales/fr/common.json";
import thCommon from "../../public/locales/th/common.json";

const resources = {
  en: { common: enCommon },
  fr: { common: frCommon },
  th: { common: thCommon },
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "th", "fr"],
      defaultNS: "common",
      ns: ["common"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        caches: ["cookie"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
      },
    });
}

export default i18n;
