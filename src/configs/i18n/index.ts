// ** I18n Imports
import i18n from 'i18next'
// import Backend from 'i18next-xhr-backend'
import HttpApi from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n

  // Enables the i18next backend
  .use(HttpApi)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    lng: 'fr',
    backend: {
      /* translation file path */
      loadPath: '/assets/data/locales/{{lng}}.json',
    },
    fallbackLng: 'fr',
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
  })

export default i18n
