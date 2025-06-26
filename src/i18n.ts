import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)// load translation using http -> see /public/locales
  .use(LanguageDetector)// detect user language
  .use(initReactI18next)// pass the i18n instance to react-i18next
  .init({
    // lng: "en",// do not define this line if you're using a language detector
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
