import {SOILS,SPECIES,CREATURES} from './model.js';
import {PLANT_BED} from './game-model.js';
import {newGarden,gardenAct} from './guided-model.js';
import {glyph,pottedPlant,soilTray,trowel,bugBox,specimenCard,sprayer,pendant} from './game-art.js';
import {gardenJar} from './guided-art.js';
const q=s=>document.querySelector(s);
let garden=newGarden(),selected=null,history=[],drag=null,suppress=false,mistTimer=null;
const copy=s=>JSON.parse(JSON.stringify(s));
q('#seal').innerHTML=glyph('leaf');q('#undo').innerHTML=glyph('undo');q('#reset').innerHTML=glyph('reset');q('#next-icon').innerHTML=glyph('check');q('#cancel-reset').innerHTML=glyph('close');q('#confirm-reset').innerHTML=glyph('check');q('#trowel').innerHTML=trowel();q('#sprayer').innerHTML=sprayer();q('#lamps').innerHTML=pendant(50);
q('#plant-shelf').innerHTML=Object.entries(SPECIES).map(([type,p])=>`<div class="plant-row"><button class="plant-choice object-button" data-kind="plant" data-type="${type}" aria-label="Pick up ${p.name}" aria-pressed="false"><span class="plant-object">${pottedPlant(type)}</span><span class="specimen-card plant-card">${specimenCard(type)}</span></button></div>`).join('');
q('#soils').innerHTML=Object.entries(SOILS).map(([type,s])=>`<button class="soil-choice object-button" data-kind="soil" data-type="${type}" aria-label="Scoop ${s.name}" aria-pressed="false"><span class="soil-object">${soilTray(type)}</span><span class="specimen-card soil-card">${specimenCard(type)}</span></button>`).join('');
q('#creature-boxes').innerHTML=Object.entries(CREATURES).map(([type,c])=>`<button class="creature-box object-button" data-kind="creature" data-type="${type}" aria-label="Pick up ${c.name}" aria-pressed="false"><span class="insect-object">${bugBox(type)}</span><span class="specimen-card insect-card">${specimenCard(type)}</span></button>`).join('');
function announce(text){q('#announcement').textContent=text;}
function fit(){q('#game').style.setProperty('--scene-scale',Math.max(.25,Math.min((innerWidth-32)/1280,(innerHeight-88)/720)));}
function render(mist=false){
 document.body.dataset.stage=garden.stage;
 q('#bottle').innerHTML=gardenJar(garden,{water:mist,preview:selected?.kind==='plant'?selected:null});
 q('#plant-panel').hidden=garden.stage!=='plants';q('#soil-panel').hidden=garden.stage!=='soil';q('#creature-panel').hidden=garden.stage!=='creatures';q('#sprayer').hidden=garden.stage!=='care';
 const titles={soil:'Add soil',plants:'Plant your terrarium',creatures:'Add tiny creatures',care:'Water & grow'};
 q('#stage-title').textContent=titles[garden.stage];q('#stage-number').textContent=String(['soil','plants','creatures','care'].indexOf(garden.stage)+1);
 q('#next').hidden=!['plants','creatures'].includes(garden.stage);q('#next').disabled=garden.stage==='plants'?!garden.plants.some(Boolean):!garden.creatures.length;
 q('#next-label').textContent=garden.stage==='plants'?'Finish planting':'Finish setup';
 q('#drop-targets').innerHTML=`<button class="jar-target" aria-label="${garden.stage==='care'?'Water terrarium':selected?'Place selected object into terrarium':'Terrarium'}"></button>`+(selected?.kind==='plant'?PLANT_BED.map((bed,i)=>`<button class="plant-slot" style="--x:${bed.x/5.6}%;--y:${bed.y/4.4}%" data-slot="${i}" aria-label="${garden.plants[i]?'Replace':'Plant in'} ${bed.name} position">${glyph(garden.plants[i]?'undo':'leaf')}</button>`).join(''):'');
 q('.bottle-wrap').classList.toggle('target-ready',Boolean(selected));
 document.querySelectorAll('[data-kind]').forEach(b=>{b.setAttribute('aria-pressed',String(selected?.kind===b.dataset.kind&&selected?.type===b.dataset.type));b.classList.toggle('added',b.dataset.kind==='creature'&&garden.creatures.includes(b.dataset.type));b.classList.toggle('suggest',garden.stage==='soil');});
 q('#sprayer').classList.toggle('suggest',garden.stage==='care'&&garden.sprays===0);q('#undo').disabled=!history.length;
 q('#growth-dots').innerHTML=Array.from({length:10},(_,i)=>`<i class="growth-dot ${i<garden.sprays?'filled':''}"></i>`).join('');q('#growth-dots').hidden=garden.stage!=='care';
}
function commit(action){const before=copy(garden);if(!gardenAct(garden,action))return false;history.push(before);if(history.length>80)history.shift();selected=null;clearTimeout(mistTimer);render(action.kind==='water');if(before.stage!==garden.stage){const target=garden.stage==='plants'?q('#plant-panel button'):garden.stage==='creatures'?q('#creature-panel button'):q('#sprayer');target?.focus({preventScroll:true});}if(action.kind==='water'){mistTimer=setTimeout(()=>render(),1100);announce('Water sprayed. The plants have grown.');}else announce(`Step: ${garden.stage}.`);return true;}
function apply(slot){if(garden.stage==='care'){commit({kind:'water'});return;}if(!selected)return;if(selected.kind==='plant'){slot=slot??garden.plants.findIndex(p=>!p);if(slot<0)slot=1;}commit({...selected,slot});}
document.addEventListener('click',e=>{if(suppress){suppress=false;return;}const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.kind){selected=selected?.kind===b.dataset.kind&&selected?.type===b.dataset.type?null:{kind:b.dataset.kind,type:b.dataset.type};render();return;}
 if(b.dataset.slot!==undefined){apply(Number(b.dataset.slot));return;}if(b.classList.contains('jar-target')){apply();return;}
 if(b.id==='sprayer'){commit({kind:'water'});return;}if(b.id==='next'){commit({kind:'next'});return;}
 if(b.id==='undo'&&history.length){garden=history.pop();selected=null;clearTimeout(mistTimer);render();return;}
 if(b.id==='reset'){q('#reset-picture').innerHTML=gardenJar(newGarden());q('#reset-dialog').showModal();return;}
 if(b.id==='cancel-reset'){q('#reset-dialog').close();return;}if(b.id==='confirm-reset'){q('#reset-dialog').close();clearTimeout(mistTimer);garden=newGarden();history=[];selected=null;render();}
});
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-kind],#sprayer');if(!b||b.disabled||e.button!==0)return;drag={x:e.clientX,y:e.clientY,item:b.id==='sprayer'?{kind:'water'}:{kind:b.dataset.kind,type:b.dataset.type},active:false};});
document.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.active&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>10){drag.active=true;selected=drag.item;render();}if(drag.active){e.preventDefault();q('#carried').innerHTML=drag.item.kind==='water'?sprayer():drag.item.kind==='soil'?trowel(drag.item.type):drag.item.kind==='plant'?pottedPlant(drag.item.type):bugBox(drag.item.type);q('#carried').classList.add('active');q('#carried').style.left=`${e.clientX}px`;q('#carried').style.top=`${e.clientY}px`;}},{passive:false});
document.addEventListener('pointerup',e=>{if(drag?.active){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.plant-slot,.jar-target');if(target)apply(target.dataset.slot===undefined?undefined:Number(target.dataset.slot));suppress=true;setTimeout(()=>suppress=false,0);}drag=null;q('#carried').classList.remove('active');});
document.addEventListener('pointercancel',()=>{drag=null;q('#carried').classList.remove('active');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){selected=null;render();}if(e.key==='z'&&(e.ctrlKey||e.metaKey)&&!q('dialog[open]')){e.preventDefault();q('#undo').click();}});
window.addEventListener('resize',fit);render();fit();
