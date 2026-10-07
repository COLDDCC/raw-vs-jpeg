import {chromium} from '@playwright/test';
import serverChromium from '@sparticuz/chromium';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const path=join(process.cwd(),'dist',url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname);const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',mime[path.slice(path.lastIndexOf('.'))]||'text/plain');res.end(await readFile(path));}catch{res.statusCode=404;res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const baseURL=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||await serverChromium.executablePath(),headless:true,args:serverChromium.args});
try {
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(baseURL+'/');await page.waitForFunction(()=>document.querySelector('#annual')?.textContent!=='—');
assert.equal(await page.locator('#annual').textContent(),'294');
await page.locator('input[value="both"]').check();assert.equal(await page.locator('#annual').textContent(),'374');
await page.locator('input[name="photos"]').fill('0');assert.equal(await page.locator('#drives').textContent(),'0 · $0.00');
await page.getByRole('button',{name:'Reset assumptions'}).click();await page.waitForTimeout(100);assert.equal(await page.locator('#annual').textContent(),'294');
await page.getByRole('button',{name:'Sony A7 III',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.raw-picture img').getAttribute('src').includes('2414'));
await page.getByRole('button',{name:'Show full frame',exact:true}).click();assert.equal(await page.locator('.image-stage').evaluate(el=>el.classList.contains('full-frame')),true);
await page.getByRole('button',{name:'Show compact view',exact:true}).click();
await page.getByRole('button',{name:'JPEG preview',exact:true}).click();assert.equal(await page.locator('.comparison-range').inputValue(),'100');
await page.getByRole('button',{name:'Split view',exact:true}).click();
await page.getByRole('link',{name:'Plan storage for this camera'}).click();assert.equal(await page.locator('select[name=camera]').inputValue(),'2414');assert.equal(await page.locator('#annual').textContent(),'256.4');
await page.locator('input[name=photos]').fill('-1');assert.equal(await page.locator('#annual').textContent(),'—');assert.equal(await page.locator('#jpeg-total').textContent(),'—');
await page.locator('input[name=photos]').fill('10000');assert.equal(await page.locator('#jpeg-total').textContent(),'80 GB');
await page.locator('.comparison-range').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.comparison-range').inputValue(),'51');
await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
await page.goto(baseURL+'/');await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
assert.equal(await page.evaluate(()=>/[\u3400-\u9fff]/.test(document.body.innerText)),false);
await page.screenshot({path:'/tmp/raw-vs-jpeg-desktop.png',fullPage:true});
for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/raw-vs-jpeg-mobile.png',fullPage:true});
await page.goto(baseURL+'/');
await page.route('**/images/898-*', route=>route.abort());
await page.getByRole('button',{name:'Nikon D750',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('.comparison-status').textContent.includes('Could not load'));
assert.match(await page.locator('.raw-picture img').getAttribute('src'),/6402/);
assert.equal(await page.locator('.comparison').getAttribute('aria-busy'),null);
await page.unroute('**/images/898-*');
await page.getByRole('button',{name:'Nikon D750',exact:true}).click();
await page.waitForFunction(()=>document.querySelector('.raw-picture img').getAttribute('src').includes('898'));
for(const [slug,id,annual] of [['canon-r6-mark-ii',6402,'294'],['sony-a7-iii',2414,'256.4'],['nikon-d750',898,'263.4']]){
 const response=await page.goto(baseURL+'/'+slug+'-raw-vs-jpeg/');assert.equal(response.status(),200);
 assert.equal(await page.locator('select[name=camera]').inputValue(),String(id));
 assert.equal(await page.locator('#annual').textContent(),annual);
 assert.match(await page.locator('.raw-picture img').getAttribute('src'),new RegExp(String(id)));
 await page.locator('input[name=photos]').fill('500');
 await page.getByRole('button',{name:'Reset assumptions'}).click();
 await page.waitForFunction(expected=>document.querySelector('#annual').textContent===expected,annual);
 assert.equal(await page.locator('select[name=camera]').inputValue(),String(id));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.evaluate(()=>/[\u3400-\u9fff]/.test(document.body.innerText)),false);
 await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
}
assert.equal((await page.goto(baseURL+'/methodology/')).status(),200);
assert.deepEqual(errors,[]);console.log('Browser checks passed: calculator, reset, camera switching, keyboard slider, images, 320/390px layout, 5 routes, image failure/retry, per-camera defaults/reset, full frame, format views, camera handoff, invalid estimates.');

} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
