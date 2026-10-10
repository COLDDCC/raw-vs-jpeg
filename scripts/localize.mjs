import {readFile,writeFile} from 'node:fs/promises';
import {translate} from '../src/data/languages.mjs';
export default function localize(){return {name:'localized-homepages',hooks:{'astro:build:done':async({dir})=>{
 for(const locale of ['pt-br','fr']){
  const file=new URL(`${locale}/index.html`,dir);let html=await readFile(file,'utf8');
  // Keep scripts, markup and structured camera data intact; localize rendered text.
  html=html.replace(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g,(all,tag,text)=>{
   if(text)return translate(text,locale);
   if(/^<(script|style)\b/.test(tag))return tag;
   return tag.replace(/((?:aria-label|aria-valuetext|title|alt|content)=")([^"]*)(")/g,(all,start,value,end)=>start+translate(value,locale)+end);
  });await writeFile(file,html);
 }
}}};}
