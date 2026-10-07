import {canIndex,site} from '../config/site.mjs';
export function GET(){return new Response(canIndex ? `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
