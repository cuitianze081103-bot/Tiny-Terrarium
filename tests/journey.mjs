// Headless DOM journey. Real-browser screenshots are checked separately.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const {JSDOM}=await import(process.env.JSDOM_MODULE||'jsdom');
const dom=new JSDOM(await readFile('dist/greenhouse-previous.html','utf8'),{url:'https://terrarium.test/'});
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
assert.equal(document.querySelectorAll('[data-card]').length,8);assert.match(q('[data-card="springtails"]').textContent,/40%–85%/);assert.match(q('[data-card="woodlice"]').textContent,/35%–75%/);assert.match(q('[data-card="humus"]').textContent,/High water retention/);
// No visible prose or tooltip titles; spoken status remains outside the visual game.
assert.equal([...document.body.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim(),'');assert.equal(document.querySelectorAll('[title]').length,0);
click('#trowel');assert.equal(q('#trowel').getAttribute('aria-pressed'),'true');
for(const soil of ['sandy','regular','humus']){choose('soil',soil);place();assert.ok(!q('[data-kind="plant"]').disabled);}
for(const [slot,type] of ['moss','fern','foliage'].entries()){choose('plant',type);click(`[data-slot="${slot}"]`);}
assert.equal(q('#day').disabled,false);assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,3);
assert.equal(q('#bottle').querySelectorAll('.growing-plant-front').length,3);assert.equal(q('#bottle').querySelectorAll('.botanical-back [data-plant-slot]').length,3);assert.equal(q('#bottle').querySelectorAll('.botanical-front [data-plant-slot]').length,3);
choose('plant','fern');click('[data-slot="2"]');assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,3);
for(let slot=3;slot<9;slot++){choose('plant',slot<5?'foliage':'moss');click(`[data-slot="${slot}"]`);}assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,9);assert.equal(q('#bottle').querySelectorAll('.growing-plant-front').length,9);
for(const type of ['springtails','woodlice']){choose('creature',type);place();assert.ok(q(`[data-type="${type}"]`).classList.contains('added'));}
choose('creature','woodlice');place();assert.ok(!q('[data-type="woodlice"]').classList.contains('added'));
click('#sprayer');place();assert.match(q('#announcement').textContent,/Water sprayed/);assert.ok(q('.water-mist'));
const dialKey=key=>q('#light-dial').dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true}));
dialKey('End');assert.equal(q('#light-dial').getAttribute('aria-valuenow'),'100');click('#undo');assert.equal(q('#light-dial').getAttribute('aria-valuenow'),'50');dialKey('Home');assert.equal(q('#light-dial').getAttribute('aria-valuenow'),'0');dialKey('PageUp');dialKey('ArrowRight');assert.equal(q('#light-dial').getAttribute('aria-valuenow'),'11');click('#undo');assert.equal(q('#light-dial').getAttribute('aria-valuenow'),'10');for(let i=0;i<4;i++)dialKey('PageUp');
choose('plant','moss');document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(q('[data-type="moss"]').getAttribute('aria-pressed'),'false');
click('#play');assert.equal(intervals.size,1);[...intervals.values()][0]();assert.match(q('#announcement').textContent,/Day 1/);click('#play');assert.equal(intervals.size,0);
click('#play');Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new window.Event('visibilitychange'));assert.equal(intervals.size,0);Object.defineProperty(document,'hidden',{value:false,configurable:true});
for(let i=1;i<7;i++)click('#day');assert.equal(q('#week-dialog').open,true);assert.equal(intervals.size,0);assert.ok(q('#week-title').textContent.length>0);assert.match(q('#week-summary').textContent,/Seven days/);assert.match(q('#week-stats').textContent,/Plant health/);assert.ok(q('#week-advice').textContent.length>20);click('#continue');click('#day');assert.match(q('#announcement').textContent,/Day 8/);assert.equal(q('#week-dialog').open,false);
click('#reset');assert.equal(q('#reset-dialog').open,true);click('#cancel-reset');assert.equal(q('#day').disabled,false);click('#reset');click('#confirm-reset');assert.equal(q('#day').disabled,true);assert.equal(q('#undo').disabled,true);assert.equal(q('#bottle').querySelectorAll('.growing-plant').length,0);
choose('soil','humus');place();choose('plant','fern');click('[data-slot="1"]');click('#play');for(let i=0;i<7;i++)[...intervals.values()][0]();assert.equal(intervals.size,0);assert.equal(q('#week-dialog').open,true);
console.log('PASS: wordless setup, all soils, all slots, replacement, both creatures, removal, water, all light controls, undo, tool cancellation, pause, hidden-tab pause, 7-day result, day 8, reset cancel/confirm, and automatic seven-day stop.');
