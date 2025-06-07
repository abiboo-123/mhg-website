import en from '../i18n/en.json';
import de from '../i18n/de.json';
import ar from '../i18n/ar.json';

const languages = { en, de, ar };

export function t(key, lang = 'en') {
  return languages[lang][key] || key;
}
