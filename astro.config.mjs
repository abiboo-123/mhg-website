import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react'; // 👈 Add this

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mhg-website-phi.vercel.app',
  integrations: [tailwind(), react(), sitemap()],
  output: 'server',
  adapter: vercel(),
});