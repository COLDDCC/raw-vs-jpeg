import {test} from 'node:test';
import assert from 'node:assert/strict';
import {translate} from '../src/data/languages.mjs';
test('localized headings and HTML-escaped metadata translate',()=>{
 assert.match(translate('RAW vs JPEG: Compare Photos Side by Side','pt-br'),/lado a lado/);
 assert.match(translate('RAW vs JPEG: Interactive Photo Comparison &amp; Storage Calculator','fr'),/calculateur/);
});
test('live results translate without changing values or translating repeatedly',()=>{
 for(const locale of ['pt-br','fr']){
  const text=translate('2 drives per copy × 2 separate local copies',locale);
  assert.ok(!text.includes('drives'));assert.ok(text.includes('2'));
  assert.equal(translate(text,locale),text);
  assert.equal(translate('80 GB','en'),'80 GB');
 }
});
