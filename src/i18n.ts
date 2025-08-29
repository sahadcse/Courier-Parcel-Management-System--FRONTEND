import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Load translations via http
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;