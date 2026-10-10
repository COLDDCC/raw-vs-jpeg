import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {site,canIndex} from '../src/config/site.mjs';
const read=path=>readFileSync(join('dist',path),'utf8');
const pages=[];
function walk(dir=''){for(const file of readdirSync(join('dist',dir),{withFileTypes:true})){const path=join(dir,file.name);if(file.isDirectory())walk(path);else if(path.endsWith('.html'))pages.push(path);}}
walk();const titles=new Set(), indexableURLs=new Set();
for(const file of pages){
 const html=read(file);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`Expected one main heading: ${file}`);assert.match(html,/<meta name="description" content="[^"]+"/);assert.match(html,/<html lang="(?:en|pt-br|fr)"/);assert.ok(!/[\u3400-\u9fff]/.test(html),`Non-English content in ${file}`);
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),`Duplicate title: ${title}`);titles.add(title);
 const path=file==='index.html'?'/':file.endsWith('/index.html')?'/'+file.slice(0,-10):'/'+file;
 if(!canIndex||file==='404.html')assert.match(html,/<meta name="robots" content="noindex,follow"/);
 if(canIndex&&!html.includes('content="noindex,follow"'))indexableURLs.add(new URL(path,site).href);
 if(site&&file!=='404.html')assert.ok(html.includes(`rel="canonical" href="${new URL(path,site).href}"`),`Incorrect canonical in ${file}`);
 for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const url=new URL(href,'https://verification.test'+path);
  const target=url.pathname.endsWith('/')?url.pathname.slice(1)+'index.html':url.pathname.slice(1);
  assert.ok(existsSync(join('dist',target)),`Broken internal resource: ${file} -> ${href}`);
  if(url.hash&&target.endsWith('.html'))assert.ok(read(target).includes(`id="${url.hash.slice(1)}"`),`Broken anchor: ${href}`);
 }
}
const robots=read('robots.txt');
if(canIndex){
 assert.ok(robots.includes(`Sitemap: ${site}/sitemap.xml`));
 const urls=[...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
 assert.equal(new Set(urls).size,urls.length);assert.deepEqual([...urls].sort(),[...indexableURLs].sort(),'Sitemap must include every indexable page exactly once');
 for(const url of urls){assert.equal(new URL(url).origin,site);assert.ok(!url.endsWith('404.html'));}
}else {assert.match(robots,/Disallow: \//);assert.ok(!existsSync('dist/sitemap.xml'));}
console.log(`Release checks passed: ${pages.length} HTML pages, titles, links, assets, anchors, canonicals and ${canIndex?'production':'preview'} indexing.`);
