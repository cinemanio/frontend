import i18n from 'i18next'
import Backend from 'i18next-sync-fs-backend'
import koaI18nextDetector from 'koa-i18next-detector'

import settings from '../settings'

i18n
  .use(Backend)
  .use(koaI18nextDetector)
  .init({
    debug: settings.debug,
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    initImmediate: false,
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2
    },
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
    detection: {
      order: ['cookie', 'header'],
      lookupCookie: settings.i18nCookieName,
    }
  })

export default i18n
