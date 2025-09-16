// 📁 scripts/translateResources.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rawResources } from '../src/data/resources.js';
import translateText, { translateArray, saveCache } from '../src/utils/translate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = ['de'];
const outputPath = path.resolve(__dirname, '../src/data/resources.translated.json');

const run = async () => {
  const output = { en: rawResources, de: [] };

  for (const lang of langs) {
    for (const section of rawResources) {
      const translatedSection = {
        category: await translateText(section.category ?? '', lang),
        type: section.type,
        items: [],
        footer: undefined,
      };

      // Footer: translate everything (labels too), keep href/external as-is
      if (section.footer) {
        const footerOut = {};
        if (section.footer.text) footerOut.text = await translateText(section.footer.text, lang);
        if (section.footer.linkText) footerOut.linkText = await translateText(section.footer.linkText, lang);
        if (section.footer.href) footerOut.href = section.footer.href;

        if (Array.isArray(section.footer.links) && section.footer.links.length > 0) {
          footerOut.links = [];
          for (const l of section.footer.links) {
            footerOut.links.push({
              label: await translateText(l.label ?? '', lang),
              href: l.href,
              external: l.external === undefined ? undefined : !!l.external,
            });
          }
        }
        translatedSection.footer = footerOut;
      }

      // Items by type
      if (section.type === 'card') {
        for (const item of section.items) {
          translatedSection.items.push({
            slug: item.slug, // keep slugs identical
            // translate names too (per your request: “translate it all”)
            name: item.name ? await translateText(item.name, lang) : '',
            locationLink: item.locationLink, // keep links as-is
            location: item.location ? await translateText(item.location, lang) : undefined,
            description: item.description ? await translateText(item.description, lang) : undefined,
            tags: Array.isArray(item.tags) ? await translateArray(item.tags, lang) : [],
          });
        }
      } else if (section.type === 'links') {
        for (const item of section.items) {
          translatedSection.items.push({
            href: item.href, // keep as-is
            label: await translateText(item.label ?? '', lang),
          });
        }
      } else if (section.type === 'list') {
        for (const item of section.items) {
          translatedSection.items.push({
            name: item.name ? await translateText(item.name, lang) : '',
            location: item.location ? await translateText(item.location, lang) : undefined,
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
