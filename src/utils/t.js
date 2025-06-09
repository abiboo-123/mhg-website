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
  return languages[lang][key] || key;
}

export async function translate(text, targetLang, sourceLang = 'en') {
  const response = await axios.post('https://libretranslate.com/translate', {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: 'text'
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  return response.data.translatedText;
}
