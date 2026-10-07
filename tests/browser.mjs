import {chromium} from '@playwright/test';
import serverChromium from '@sparticuz/chromium';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||await serverChromium.executablePath(),headless:true,args:serverChromium.args});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4321/');await page.waitForFunction(()=>document.querySelector('#annual')?.textContent!=='—');
assert.equal(await page.locator('#annual').textContent(),'294');
await page.locator('input[value="both"]').check();assert.equal(await page.locator('#annual').textContent(),'374');
await page.locator('input[name="photos"]').fill('0');assert.equal(await page.locator('#drives').textContent(),'0 · $0.00');
await page.getByRole('button',{name:'Reset assumptions'}).click();await page.waitForTimeout(100);assert.equal(await page.locator('#annual').textContent(),'294');
await page.getByRole('button',{name:'Sony A7 III',exact:true}).click();assert.match(await page.locator('.raw-picture img').getAttribute('src'),/2414/);
await page.locator('.comparison-range').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.comparison-range').inputValue(),'51');
await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0));
await page.screenshot({path:'/tmp/raw-vs-jpeg-desktop.png',fullPage:true});
for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/raw-vs-jpeg-mobile.png',fullPage:true});
for(const path of ['/canon-r6-mark-ii-raw-vs-jpeg/','/methodology/']){const response=await page.goto('http://localhost:4321'+path);assert.equal(response.status(),200);}
assert.deepEqual(errors,[]);await browser.close();console.log('Browser checks passed: calculator, reset, camera switching, keyboard slider, images, 320/390px layout, 3 routes.');
