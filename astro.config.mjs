import { defineConfig } from 'astro/config';
import path from 'path';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    base: '/cosy-ui/',
    srcDir: 'src',
    outDir: 'dist',
    vite: {
        resolve: {
            alias: {
                '@': path.resolve('./src'),
            },
        },
    },

    integrations: [mdx()],
});
