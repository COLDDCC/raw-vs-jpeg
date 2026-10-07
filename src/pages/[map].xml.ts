import type { APIContext } from 'astro';
import {sitePages} from '../data/site-pages';
import {canIndex} from '../config/site.mjs';
export function getStaticPaths(){return canIndex ? [{params:{map:'sitemap'}}] : [];}
export function GET({site}: APIContext){
 const escape=(text:string)=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const urls=sitePages.map(path=>`<url><loc>${escape(new URL(path,site).href)}</loc></url>`).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
