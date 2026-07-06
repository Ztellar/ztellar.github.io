import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ztellar.github.io',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
