# Production setup

This is a static Astro site. No paid server, database, image-upload service or API key is needed.

## Cloudflare Pages

Connect `COLDDCC/raw-vs-jpeg` through Git integration and use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `24` (also pinned in `.node-version`) |
| Production environment `SITE_URL` | The final HTTPS origin, with no path or query |

Configure the custom domain through Pages, then rebuild after setting `SITE_URL`. The preferred domain must match the variable exactly; redirect alternate `www`/apex addresses to the preferred domain at the host. Do not use a temporary `pages.dev` URL as the production origin.

Without `SITE_URL`, the site still builds for review but outputs `noindex` metadata and `Disallow: /` in robots.txt. Non-main Cloudflare branch builds use the same preview protection and omit the sitemap. These crawler directives are not access controls; previews remain publicly viewable.

## Verify the live site

Open the homepage, all three camera guides and `/privacy/`. Confirm slider operation, image switching, calculator changes and mobile layout. Then inspect `/robots.txt`, `/sitemap.xml` and the homepage canonical: all should use the final domain and production should allow indexing. The sitemap contains six indexable pages; 404 is excluded. Submit `/sitemap.xml` in Google Search Console after domain verification.

## Current scope

These samples compare embedded camera previews with developed RAW exports. They do not prove controlled highlight recovery, white-balance correction or noise differences. No monetization, analytics or cookies are enabled by application code. The privacy page describes this version only; update it before adding analytics, ads, forms or accounts.

Reference: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
