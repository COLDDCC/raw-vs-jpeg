export function productionOrigin(value) {
 if (!value) return undefined;
 const url = new URL(value);
 if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('SITE_URL must be an HTTPS origin without a path, query or credentials.');
 return url.origin;
}
export const site = productionOrigin(process.env.SITE_URL);
export const isPreview = Boolean(process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== (process.env.PRODUCTION_BRANCH || 'main'));
export const canIndex = Boolean(site && !isPreview);
