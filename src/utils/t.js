import en from '../i18n/en.json';
import de from '../i18n/de.json';
import axios from 'axios';
/**
 * Translation utility for the application.
 * It supports multiple languages and can translate text using an external service.
 */
const languages = { en, de };

export function t(key, lang = 'en') {
  if (!languages[lang]) {
    console.warn(`Language ${lang} not found, defaulting to English.`);
    lang = 'en';
  }
  return languages[lang][key] || key;
}
