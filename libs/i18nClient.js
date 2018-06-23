import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

import settings from '../settings'
import ru from '../locales/ru/translation.json'
import en from '../locales/en/translation.json'

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    debug: settings.debug,
    // fallbackLng: 'en',
    resources: {
      ru: { translation: ru },
      en: { translation: en }
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
      order: ['htmlTag'],
    },
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) =>
      console.error(`Key "${key}" not found in namespace "${ns}" of language "${lng}"`)
  })

export default i18n
