import { defineConfig } from 'astro/config';
import { site } from './src/config/site.mjs';
import localize from './scripts/localize.mjs';
export default defineConfig({ output: 'static', integrations: [localize()], site, trailingSlash: 'always' });
