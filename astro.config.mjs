import { defineConfig } from 'astro/config';
import { site } from './src/config/site.mjs';
import localize from './scripts/localize.mjs';
import socialCards from './scripts/social-cards.mjs';
export default defineConfig({ output: 'static', integrations: [localize(),socialCards()], site, trailingSlash: 'always' });
