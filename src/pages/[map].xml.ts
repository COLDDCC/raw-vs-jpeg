import type { APIContext } from 'astro';
import {sitePages} from '../data/site-pages';
import {canIndex} from '../config/site.mjs';
export function getStaticPaths(){return canIndex ? [{params:{map:'sitemap'}}] : [];}
export function GET({site}: APIContext){
 const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const locales=[['en','/'],['pt-BR','/pt-br/'],['fr','/fr/'],['x-default','/']] as const;
 const urls=sitePages.map(path=>{
  const alternates=['/','/pt-br/','/fr/'].includes(path)? locales.map(([lang,href])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escape(new URL(href,site).href)}"/>`).join(''):'';
  return `<url><loc>${escape(new URL(path,site).href)}</loc>${alternates}</url>`;
 }).join('');
 // Omit lastmod rather than fabricate a date unrelated to each page's actual content revision.
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}