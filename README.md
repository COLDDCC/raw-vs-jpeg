# RAW vs JPEG — MVP

English photography tool: three CC0 sample comparisons, an editable storage calculator, three camera field-notes pages (Canon R6 Mark II, Sony A7 III and Nikon D750) and an open methodology page. Astro static output; native CSS/JS slider. No uploads, accounts, ads or affiliates.

## Run

Node 24 or later recommended.

```sh
npm ci
npm run dev
npm test
npm run build
```

Deploy to Cloudflare Pages: build `npm run build`, output `dist`. Set `SITE_URL` to the final HTTPS origin for production canonicals, sitemap and robots. Without it, the build is protected from indexing. See [production setup](docs/deployment.md).

## Integrity and limitations

The comparison is embedded camera JPEG preview vs LibRaw-developed RAW, **not** a separate full-resolution camera JPEG and **not** a controlled exposure/WB/noise experiment. RAW is explicitly labeled developed. Three CC0 originals were downloaded and SHA-256 verified. `src/data/samples.json` records original byte sizes, processing modes, source URLs and checksums. Originals are not committed.

Calculator RAW defaults are single measured files, not camera averages. JPEG defaults to an editable 8 MB assumption. Decimal storage units, rounded whole-card/whole-drive counts and user-entered prices are disclosed. There is no verified burst-buffer calculation.

## Reproduce images

```sh
pip install -r scripts/requirements.txt
python scripts/prepare_samples.py
```

See `public/recipe.txt`. First image is eager-loaded; alternate-camera images load on selection. WebP images have JPEG fallbacks. No synthetic RAW or AI photo is used.

## Next milestone

Acquire controlled same-capture RAW + full-resolution camera JPEG pairs for recovery experiments. Add camera pages only with unique samples and useful data. Set the production origin and verify generated canonicals, sitemap and robots after deployment. Run actual mobile-network performance checks before claiming Core Web Vitals targets.

## Preview

![Desktop MVP](docs/desktop.jpg)

Browser checks covered camera switching, keyboard slider, calculator/reset, image loading, five routes and overflow at 320/390px.

## Usability update

All visitor-facing copy remains English (US formatting and USD). The comparator now includes full-frame viewing, JPEG/RAW/split controls, preloaded camera switching and a direct handoff to the storage calculator. The calculator compares all formats, provides static default results and clears outdated estimates on invalid input.

Browser verification after building:

```sh
node tests/browser.mjs
```

The test starts and stops its own static server. Set `CHROMIUM_PATH` to use an existing Chromium binary if necessary.

## Camera guides

`src/data/cameras.json` stores camera-specific descriptions and FAQs. `src/pages/[camera].astro` generates the three guides with distinct CC0 image pairs, sample-specific planning tables and calculator defaults. Adding a guide requires its own measured sample and editorial record. No generic placeholder camera pages are generated. Browser checks verify each guide’s sample, initial camera, reset state and mobile overflow, plus failed-image recovery.

## Reliability update

Failed WebP requests now fall back to JPEG both on initial display and when switching cameras. Storage estimates allocate drives separately per local copy, including the original; a 294 GB year with two local copies therefore needs two new 2 TB drives under the default assumptions. Existing computer space is not deducted. Numeric overflow is rejected. Tests cover separate-copy rounding, WebP failures, retries and no-JavaScript defaults.

## Release verification

```sh
npm run build
node scripts/verify-site.mjs
```

Preview builds omit the sitemap and disallow indexing. Production builds use `SITE_URL` to generate six sitemap entries, correct canonical URLs and indexing permissions. Privacy and 404 pages are included.

## Input recovery

Invalid values now identify the field and its allowed range or increment. “Review invalid input” opens advanced settings when necessary and focuses the field. Valid edits clear the error state. The calculator prevents form submission so inputs stay on the page. Drive allocation is visible on touch devices, and source download links show their original file sizes. Release verification checks main headings, descriptions and exact sitemap coverage.
