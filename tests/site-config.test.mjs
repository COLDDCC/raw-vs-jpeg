import {test} from 'node:test';
import assert from 'node:assert/strict';
import {productionOrigin} from '../src/config/site.mjs';
test('missing origin stays unset; valid HTTPS origins normalize',()=>{assert.equal(productionOrigin(''),undefined);assert.equal(productionOrigin('https://raw-jpeg.test/'),'https://raw-jpeg.test');});
test('canonical origins reject paths, credentials, queries and HTTP',()=>{for(const origin of ['http://raw-jpeg.test','https://raw-jpeg.test/path','https://raw-jpeg.test/?x=1','https://raw-jpeg.test/#a','https://a:b@raw-jpeg.test'])assert.throws(()=>productionOrigin(origin));});
