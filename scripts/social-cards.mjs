import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
import {sitePages} from '../src/data/site-pages.ts';
import samples from '../src/data/samples.json' with {type:'json'};
const escape=(s)=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const label=(path)=>{
 if(path==='/')return ['RAW vs JPEG','Real samples & storage'];
 if(path==='/pt-br/')return ['RAW vs JPEG','Compare fotos e armazenamento'];
 if(path==='/fr/')return ['RAW vs JPEG','Comparez les images et le stockage'];
 const camera=samples.find(s=>path===`/${s.slug}-raw-vs-jpeg/`);
 if(camera)return [camera.brand+' '+(camera.model==='ILCE-7M3'?'A7 III':camera.model), (camera.rawBytes/1e6).toFixed(2)+' MB measured RAW'];
 const map={
 '/cameras/':['Camera RAW File Sizes','Measured samples · Canon / Sony / Nikon'],
 '/memory-card-calculator/':['Memory Card Calculator','RAW · JPEG · RAW + JPEG'],
 '/raw-file-size/':['How Big Is a RAW File?','Original camera measurements'],
 '/compressed-vs-uncompressed-raw/':['RAW Compression Guide','Lossless · lossy · uncompressed'],
 '/raw-plus-jpeg/':['Shoot RAW + JPEG?','When both formats make sense'],
 '/methodology/':['Sources & Methodology','Traceable CC0 originals'],
 '/about/':['About RAW vs JPEG','Open methods · practical tools'],
 '/privacy/':['Privacy','Browser-based storage calculator']
 };
 return map[path] || ['RAW vs JPEG','Photography field notes'];
};
export default function socialCards(){return {name:'static-social-cards',hooks:{'astro:build:done':async({dir})=>{
 const folder=new URL('og/',dir);await mkdir(folder,{recursive:true});
 for(const path of sitePages){
  const [heading,sub]=label(path);
  const filename=path==='/'?'home':path.slice(1,-1).replaceAll('/','-');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f8f7f3"/><rect x="48" y="48" width="1104" height="534" rx="22" fill="#e9eee4" stroke="#b6cbbd" stroke-width="2"/><path d="M735 49 L1152 49 L1152 582 L735 582 Z" fill="#174b3c"/><circle cx="944" cy="310" r="175" fill="#2b6d54"/><circle cx="944" cy="310" r="125" fill="#e6e9dc"/><path d="M944 185 A125 125 0 0 1 944 435 Z" fill="#173f34"/><text x="92" y="133" font-size="30" font-weight="700" font-family="Arial,sans-serif" letter-spacing="3" fill="#174b3c">RAW / JPEG</text><text x="92" y="270" font-size="55" font-weight="700" font-family="Arial,sans-serif" fill="#1c352a">${escape(heading.length>25?heading.slice(0,25)+'…':heading)}</text><text x="92" y="340" font-size="29" font-family="Arial,sans-serif" fill="#536054">${escape(sub.length>37?sub.slice(0,37)+'…':sub)}</text><line x1="92" y1="443" x2="655" y2="443" stroke="#b6cbbd" stroke-width="2"/><text x="92" y="507" font-size="24" font-family="Arial,sans-serif" fill="#536054">raw-vs-jpeg.com</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(new URL(filename+'.png',folder));
 }
}}};}