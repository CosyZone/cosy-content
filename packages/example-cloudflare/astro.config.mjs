// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import cloudflare from '@astrojs/cloudflare';

import mdx from '@astrojs/mdx';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },

  integrations: [mdx(), vue()],
});