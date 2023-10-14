import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  build: {
    format: 'directory'
  },
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, [rehypeExternalLinks, {
      rel: ['noopener', 'noreferrer'],
      target: '_blank'
    }]],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'material-theme',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true
    }
  }
});