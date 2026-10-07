import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {calculateStorage} from '../src/data/storage.mjs';
const base={rawMB:30,jpegMB:8,photos:10000,format:'raw',cardGB:128,copies:2,drivePrice:80,driveTB:2,cloudPerTB:60};
test('RAW + JPEG, card rounding and backup copies',()=>{const r=calculateStorage({...base,format:'both'});assert.equal(r.annualGB,380);assert.equal(r.cards,3);assert.equal(r.backupGB,760);assert.equal(r.driveCost,160);assert.equal(r.cloudCost,22.8);});
test('zero photos require zero purchases',()=>{const r=calculateStorage({...base,photos:0});assert.equal(r.driveCost,0);assert.equal(r.cards,0);assert.equal(r.cloudCost,0);});
test('invalid divisor and nonfinite input rejected',()=>{assert.throws(()=>calculateStorage({...base,cardGB:0}));assert.throws(()=>calculateStorage({...base,photos:NaN}));});
test('three measured sources match bytes without rounding drift',()=>{const sources=JSON.parse(readFileSync(new URL('../src/data/samples.json',import.meta.url)));for(const s of sources){const r=calculateStorage({...base,rawMB:s.rawBytes/1e6,photos:1000});assert.ok(Math.abs(r.annualGB-s.rawBytes/1e6)<1e-9);assert.equal(s.license,'CC0-1.0');assert.match(s.sha256,/^[a-f0-9]{64}$/);}});

test('fractional counts are rejected',()=>{assert.throws(()=>calculateStorage({...base,photos:1.5}));assert.throws(()=>calculateStorage({...base,copies:1.5}));});

test('backup copies require separate drives even when pooled space would fit',()=>{const r=calculateStorage({...base,rawMB:30,photos:100000});assert.equal(r.annualGB,3000);assert.equal(r.drivesPerCopy,2);assert.equal(r.driveCount,4);assert.equal(r.driveCost,320);});
test('overflow does not produce an infinite estimate',()=>{assert.throws(()=>calculateStorage({...base,rawMB:Number.MAX_VALUE,photos:10000}));});
