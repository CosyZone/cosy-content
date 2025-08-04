// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import path from 'path';

import mdx from '@astrojs/mdx';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: 'standalone' }),

  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },

  integrations: [mdx(), vue()],
});