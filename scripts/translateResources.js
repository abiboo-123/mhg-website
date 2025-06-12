// 📁 scripts/translateResources.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rawResources } from '../src/data/resources.js';
import translateText, { translateArray, saveCache } from '../src/utils/translate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = ['de', 'ar'];
const outputPath = path.resolve(__dirname, '../src/data/resources.translated.json');

const run = async () => {
  const output = { en: rawResources, de: [], ar: [] };

  for (const lang of langs) {
    for (const section of rawResources) {
      const translatedSection = {
        category: await translateText(section.category, lang),
        type: section.type,
        items: [],
        footer: section.footer
          ? {
              text: await translateText(section.footer.text, lang),
              linkText: await translateText(section.footer.linkText, lang),
              href: section.footer.href,
            }
          : undefined
      };

      if (section.type === 'card') {
        for (const item of section.items) {
          translatedSection.items.push({
            name: item.name,
            location: await translateText(item.location, lang),
            description: await translateText(item.description, lang),
            tags: item.tags ? await translateArray(item.tags, lang) : []
          });
        }
      } else if (section.type === 'links') {
        for (const item of section.items) {
          translatedSection.items.push({
            href: item.href,
            label: await translateText(item.label, lang)
          });
        }
      }

      output[lang].push(translatedSection);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  saveCache();
  console.log('✅ Resource translations completed.');
};

run();
