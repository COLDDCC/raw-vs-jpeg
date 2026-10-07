import { defineConfig } from 'astro/config';
import { site } from './src/config/site.mjs';
export default defineConfig({ output: 'static', site, trailingSlash: 'always' });
