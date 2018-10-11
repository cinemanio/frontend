const debug = process.env.NODE_ENV === 'development'
module.exports = {
  webpackServerHost: process.env.WEBPACK_SERVER_HOST || '127.0.0.1:3001',
  koaServerPort: process.env.PORT || 3000,
  backendApiUrl: process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/graphql/',
  searchAppId: process.env.ALGOLIASEARCH_APPLICATION_ID,
  searchApiKey: process.env.ALGOLIASEARCH_API_KEY,
  baseDir: __dirname,
  env: process.env.NODE_ENV || 'development',
  debug,
  domain: process.env.DOMAIN,
  languages: [
    ['en', 'English'],
    ['ru', 'Русский']
  ],
  i18nCookieName: 'lang',
  i18n: {
    debug,
    // fallbackLng: 'en',
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
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => console.error(
      `Key "${key}" not found in namespace "${ns}" of language "${lng}"`)
  }
}
