import i18n from 'i18next'
import Backend from 'i18next-node-fs-backend';
import LanguageDetector from 'i18next-browser-languagedetector'

import settings from '../settings'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: settings.debug,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    // react i18next special options (optional)
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    }
  })

export default i18n
