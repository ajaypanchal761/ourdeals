import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import { LOCALES } from "./data/locales";

// Merge static locales with JSON translations
// Merge static locales with JSON translations
const hiResources = { ...hi, ...LOCALES.hi };

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hiResources },
            mr: { translation: LOCALES.mr },
            pa: { translation: LOCALES.pa },
            gu: { translation: LOCALES.gu },
            bn: { translation: LOCALES.bn },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
