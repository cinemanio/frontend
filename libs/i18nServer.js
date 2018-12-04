import i18n from 'i18next'
import Backend from 'i18next-sync-fs-backend'
import koaI18nextDetector from 'koa-i18next-detector'

import settings from 'settings'

i18n
  .use(Backend)
  .use(koaI18nextDetector)
  .init({
    ...settings.i18n,
    preload: settings.languages.map(([lang]) => lang),
    initImmediate: false,
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2,
    },
    detection: {
      order: ['cookie', 'header'],
      lookupCookie: settings.i18nCookieName,
    },
  })

export default i18n
