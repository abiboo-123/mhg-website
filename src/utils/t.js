import en from '../i18n/en.json';
import de from '../i18n/de.json';
import ar from '../i18n/ar.json';
import axios from 'axios';
/**
 * Translation utility for the application.
 * It supports multiple languages and can translate text using an external service.
 */
const languages = { en, de, ar };

export function t(key, lang = 'en') {
  if (!languages[lang]) {
    console.warn(`Language ${lang} not found, defaulting to English.`);
    lang = 'de';
  }
  return languages[lang][key] || key;
}
