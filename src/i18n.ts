import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

const LANG_KEY = 'yaku_lang'

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: localStorage.getItem(LANG_KEY) ?? 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', lang => localStorage.setItem(LANG_KEY, lang))

export default i18n
