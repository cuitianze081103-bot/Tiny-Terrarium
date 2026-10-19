// Headless DOM journey. Real-browser screenshots are checked separately.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const {JSDOM}=await import(process.env.JSDOM_MODULE||'jsdom');
const dom=new JSDOM(await readFile('dist/index.html','utf8'),{url:'https://terrarium.test/'});
globalThis.window=dom.window;globalThis.document=dom.window.document;
globalThis.requestAnimationFrame=()=>0;
const intervals=new Map();let serial=0;
globalThis.setInterval=fn=>{intervals.set(++serial,fn);return serial;};globalThis.clearInterval=id=>intervals.delete(id);
globalThis.setTimeout=()=>++serial;globalThis.clearTimeout=()=>{};
window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};window.HTMLDialogElement.prototype.close=function(){this.open=false;};
await import(pathToFileURL(path.resolve('dist/game.js')).href);
const q=s=>document.querySelector(s),click=s=>{assert.ok(q(s),s);assert.ok(!q(s).disabled,`Disabled: ${s}`);q(s).click();};
const place=()=>click('.jar-target'),choose=(kind,type)=>click(`[data-kind="${kind}"][data-type="${type}"]`);
assert.equal(q('#day').disabled,true);assert.equal(q('[data-kind="plant"]').disabled,true);
// No visible prose or tooltip titles; spoken status remains outside the visual game.
assert.equal([...document.body.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim(),'');assert.equal(document.querySelectorAll('[title]').length,0);
click('#trowel');assert.equal(q('#trowel').getAttribute('aria-pressed'),'true');
for(const soil of ['sandy','regular','humus']){choose('soil',soil);place();assert.ok(!q('[data-kind="plant"]').disabled);}
for(const [slot,type] of ['moss','fern','foliage'].entries()){choose('plant',type);click(`[data-slot="${slot}"]`);}
assert.equal(q('#day').disabled,false);assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,3);
choose('plant','fern');click('[data-slot="2"]');assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,3);
for(const type of ['springtails','woodlice']){choose('creature',type);place();assert.ok(q(`[data-type="${type}"]`).classList.contains('added'));}
choose('creature','woodlice');place();assert.ok(!q('[data-type="woodlice"]').classList.contains('added'));
click('#sprayer');place();assert.match(q('#announcement').textContent,/Water sprayed/);assert.ok(q('.water-mist'));
click('[data-light="80"]');assert.equal(q('[data-light="80"]').getAttribute('aria-pressed'),'true');click('#undo');assert.equal(q('[data-light="50"]').getAttribute('aria-pressed'),'true');
choose('plant','moss');document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(q('[data-type="moss"]').getAttribute('aria-pressed'),'false');
click('#play');assert.equal(intervals.size,1);[...intervals.values()][0]();assert.match(q('#announcement').textContent,/Day 1/);click('#play');assert.equal(intervals.size,0);
click('#play');Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));assert.equal(intervals.size,0);Object.defineProperty(document,'hidden',{value:false,configurable:true});
for(let i=1;i<7;i++)click('#day');assert.equal(q('#week-dialog').open,true);assert.equal(intervals.size,0);click('#continue');click('#day');assert.match(q('#announcement').textContent,/Day 8/);assert.equal(q('#week-dialog').open,false);
click('#reset');assert.equal(q('#reset-dialog').open,true);click('#cancel-reset');assert.equal(q('#day').disabled,false);click('#reset');click('#confirm-reset');assert.equal(q('#day').disabled,true);assert.equal(q('#undo').disabled,true);assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,0);
choose('soil','humus');place();choose('plant','fern');click('[data-slot="1"]');click('#play');for(let i=0;i<7;i++)[...intervals.values()][0]();assert.equal(intervals.size,0);assert.equal(q('#week-dialog').open,true);
console.log('PASS: wordless setup, all soils, all slots, replacement, both creatures, removal, water, all light controls, undo, tool cancellation, pause, hidden-tab pause, 7-day result, day 8, reset cancel/confirm, and automatic seven-day stop.');
