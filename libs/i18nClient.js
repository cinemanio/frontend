import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

import settings from 'settings'

import ru from '../locales/ru/translation'
import en from '../locales/en/translation'

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    ...settings.i18n,
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    detection: {
      order: ['htmlTag'],
    },
  })

export default i18n
