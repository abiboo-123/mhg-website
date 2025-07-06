// scripts/translateEvents.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { events } from '../src/data/events.raw.js';
import translateText, { translateArray, saveCache } from '../src/utils/translate.js';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../src/data/events.translated.json');
const langs = ['de', 'ar'];

const run = async () => {
  const output = { en: events, de: [], ar: [] };

  for (const lang of langs) {
    for (const event of events) {
      const translated = {
        ...event,
        title: await translateText(event.title, lang),
        description: await translateText(event.description, lang),
        location: await translateText(event.location, lang),
        tags: event.tags ? await translateArray(event.tags, lang) : [],
        language: [...new Set([...(event.language || []), lang])],
        date: await translateText(event.date, lang)
      };

      output[lang].push(translated);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  saveCache();
  console.log('✅ Event translations completed.');
};

run();
