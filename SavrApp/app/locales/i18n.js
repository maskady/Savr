
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en';
import si from './si';

// Initialize i18next with your translations
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
  },
  lng: Localization.locale.split('-')[0], // Extract language code (e.g., 'en' from 'en-US')
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // Not needed for React
  },
});

export default i18n;