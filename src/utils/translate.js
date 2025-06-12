// 🔧 translate.js (generic reusable module)
import fs from 'fs';
import path from 'path';
import translate from 'translate-google';

const cachePath = path.resolve('.cache/translation.cache.json');
let cache = {};

// Load cache on module load
if (fs.existsSync(cachePath)) {
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } catch {
    console.warn('⚠️ Translation cache was corrupt. Starting fresh.');
  }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export default async function translateText(text, targetLang) {
  const key = `${text}::${targetLang}`;
  if (cache[key]) return cache[key];

  try {
    const result = await translate(text, { to: targetLang });
    cache[key] = result;
    await delay(300);
    return result;
  } catch (err) {
    console.error(`❌ Failed to translate '${text}' → ${targetLang}`);
    return text;
  }
}

export function saveCache() {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
} 

export async function translateArray(arr, lang) {
  const results = [];
  for (const item of arr) {
    results.push(await translateText(item, lang));
  }
  return results;
}
