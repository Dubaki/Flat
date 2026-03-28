import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://Dubaki.github.io',
  base: '/Flat',
  integrations: [
    react(),
    sitemap(),
  ],
  output: 'static',
  build: {
    format: 'directory'
  }
});
