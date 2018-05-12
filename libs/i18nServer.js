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
    // detection: {
    //   order: ['querystring', 'path', 'cookie', 'header', 'session'],
    //
    //   lookupQuerystring: 'lng',
    //
    //   lookupParam: 'lng', // for route like: 'path1/:lng/result'
    //   lookupFromPathIndex: 0,
    //
    //   // currently using ctx.cookies
    //   lookupCookie: 'i18next',
    //   // cookieExpirationDate: new Date(), // default: +1 year
    //   // cookieDomain: '', // default: current domain.
    //
    //   // currently using ctx.session
    //   lookupSession: 'lng',
    //
    //   // other options
    //   lookupMySession: 'lang',
    //
    //   // cache user language
    //   caches: ['cookie']
    // }
  })

export default i18n
